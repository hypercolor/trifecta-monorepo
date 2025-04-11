import { Mapper } from "shared-types";
import { ILambdaSubmitterConfig, ITaskResult } from './sqs-worker-types';
import SQS from 'aws-sdk/clients/sqs';

export interface ITask {
  runWrapper(): Promise<ITaskResult | void>;
}

abstract class Task {
  public static workerConfig: ILambdaSubmitterConfig;

  // runWrapper: intermediate classes
  // run: concrete classes
  public abstract runWrapper(): Promise<ITaskResult | void>;
  public abstract run(): Promise<ITaskResult | void>;

  public static build<T = Task>(this: new() => T, parameters?: { [key in keyof T]?: any }) {
    return Mapper.mapInput(parameters || {}, this);
  }

  public async submit(delaySeconds?: number) {
    const config: ILambdaSubmitterConfig = (this.constructor as any).workerConfig;
    if (!config) {
      return Promise.reject(
        new Error(
          'Worker config not set for task ' + this.constructor.name + ', was it registered with a SqsWorkerSubmitter?'
        )
      );
    } else {
      const params: any = {
        type: this.constructor.name,
        parameters: this,
      };

      // const record = await SqsMessageRepository.save(SqsMessageRepository.create({
      //   createdAt: new Date(),
      //   type: params.type,
      //   parameters: params.parameters,
      //   queueUrl: config.sqsUrl,
      // }));

      // (params).messageId = record.sqsMessageId.toString();

      return new SQS({
        // credentials,
        // region,
      })
        .sendMessage({
          DelaySeconds: delaySeconds || 0,
          MessageAttributes: {
            type: {
              DataType: 'String',
              StringValue: this.constructor.name,
            },
          },
          MessageBody: JSON.stringify(params),
          QueueUrl: config.sqsUrl,
        })
        .promise();
    }
  }
}

export abstract class RetryableTask extends Task {
  public async runWrapper(): Promise<ITaskResult | void> {
    return this.run();
  }
}

export abstract class NonRetryableTask extends Task {
  public async runWrapper(): Promise<ITaskResult | void> {
    try {
      const result = await this.run();
      return result;
    } catch (err: any) {
      return { error: err };
    }
  }
}
