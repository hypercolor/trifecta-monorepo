import {Message} from "@aws-sdk/client-sqs";
import MD5 from "md5";
import {TaskFactory} from "./task-factory";
import { Logger } from '../../util/logger';
import { ITaskExecutorConfig } from "./i-task-executor-config";

export class TaskExecutor {
    constructor(private config: ITaskExecutorConfig) {}

    private log(message: string) {
        if (this.config.verbose) {
            Logger.log(this.config.id + ": " + message);
        }
    }

    public async handler(msg: Message) {

        const bodyString: string | undefined = msg.Body || (msg as any).body;
        const expectedMd5: string = msg.MD5OfBody || (msg as any).md5OfBody;
        const attributes = msg.Attributes || (msg as any).attributes;
        const messageId = msg.MessageId || (msg as any).messageId;

        const start = new Date();
        if (!bodyString) {
            this.log("Invalid message, no body: " + JSON.stringify(msg));
            return;
        }
        const md5OfBody = MD5(bodyString);
        if (md5OfBody !== expectedMd5) {
            this.log("Invalid message, md5 mismatch: " + md5OfBody + " != " + expectedMd5 + ", body was: " + bodyString);
            return;
        }
        let parsedBody = JSON.parse(bodyString);
        if (!parsedBody.type || typeof parsedBody.type !== "string") {
            this.log("Invalid message, message type not found or recognized: " + JSON.stringify(msg));
            return;
        }
        // const sqsMessageId = await SqsMessageActivityService.recordMessageReceived(messageId, parsedBody, this.config.sqsUrl);
        parsedBody = {
            ...parsedBody,
            // sqsMessageId
        }
        const task = await this.parseTask(parsedBody);
        if (!task) {
            this.log("Failed to parse task, exiting");
            return;
        }
        try {
            const receiveCount = parseInt(attributes?.ApproximateReceiveCount || "1");
            const firstSent = new Date(parseInt(attributes?.SentTimestamp || new Date().getTime().toString()));

            this.log("Starting task from message: " + bodyString);

            if (!isNaN(receiveCount) && receiveCount > 1) {
                const elapsedSeconds = (new Date().getTime() - firstSent.getTime()) / 1000;
                this.log("This message has now been received " + receiveCount + " times, it was first sent " + elapsedSeconds + " seconds ago.");
                this.log("Full message: " + JSON.stringify(msg));
            }

            const result = await task.runWrapper();

            if (result && result.error) {
                // await SqsMessageActivityService.recordMessageError(parsedBody, new Date().getTime() - start.getTime(), result.error);
                this.log(`Task ${TaskExecutor.parseMessageType(attributes)} [${messageId}] failed (not retryable): ${result.error}`);
            } else {
                // await SqsMessageActivityService.recordMessageProcessed(parsedBody, new Date().getTime() - start.getTime());
                this.log(`${task.constructor.name} [${messageId}] complete in ${TaskExecutor.getDuration(start)}${result && result.info ? ": " + result.info : ""}`);
            }
        } catch (err) {
            // await SqsMessageActivityService.recordMessageErrorRetryable(parsedBody, new Date().getTime() - start.getTime(), err);
            this.log(`Task ${TaskExecutor.parseMessageType(attributes)} [${messageId}] failed (retryable): ${err}`);
            throw err;
        }

    }



    private async parseTask(body: any) {
        return TaskFactory.build(body.type, body.parameters).catch((err) => {
            this.log(`Failed to construct task for type ${body.type} with params: ${JSON.stringify(body.parameters)} error: ${err}`);
            return undefined;
        });
    }

    private static parseMessageType(messageAttributes: any) {
        return messageAttributes && messageAttributes.type && messageAttributes.type.StringValue ?
          messageAttributes.type.StringValue :
          "unknown";
    }

    private static getDuration(start: Date) {
        const duration = new Date().getTime() - start.getTime();
        if (duration < 1000) {
            return `${duration} ms`;
        } else if (duration < 60 * 1000) {
            return `${(duration / 1000).toFixed(2)} sec`;
        } else if (duration < 3600 * 1000) {
            return `${(duration / 1000 / 60).toFixed(2)} min`;
        } else {
            return `${(duration / 1000 / 3600).toFixed(2)} hrs`;
        }
    }
}
