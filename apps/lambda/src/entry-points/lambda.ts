import 'reflect-metadata';
import { Logger } from '../util/logger';
import {TaskExecutor} from "../worker/lib/task-executor";
import {Message} from "@aws-sdk/client-sqs";
import { WorkerInitializer } from '../worker/worker-initializer';
import {Config} from "../util/config";
import { Mapper, UserResponseDto } from "shared-types";

const user = Mapper.mapInput({
  id: 1,
  name: 'John Doe',
}, UserResponseDto);
console.log('mapped user: ', user);

class MessageProcessor {
  private taskExecutor = new TaskExecutor({
    id: 'lambda',
    sqsUrl: Config.SQS_URL_LAMBDA || 'lambda',
    verbose: true
  })
  private initComplete = false;

  public async init() {
    if (this.initComplete) {
      return;
    }

    await WorkerInitializer.init();

    this.initComplete = true;
  }

  public async handler(event: { Records: Array<Message> }) {
    if (!this.initComplete) {
      await this.init();
    }

    try {
      await Promise.all((event?.Records || []).map(record => this.taskExecutor.handler(record)));
    } catch (err) {
      Logger.error('Error processing message:', err);
      Logger.error('Error stack:', (err as any).stack);
    }
  }
}

export class Processor {
  private static messageProcessor = new MessageProcessor();
  public static async handler(event: { Records: Array<Message> }, context: string) {
    return Processor.messageProcessor.handler(event);
  }
}
