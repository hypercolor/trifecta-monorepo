import 'reflect-metadata';
import { Config } from '../util/config';
import { TaskRegistry } from './task-registry';
import { TaskFactory } from './lib/task-factory';

export class WorkerInitializer {
  public static async init(initTasks: boolean = true) {
  }

  private static initTasks() {
    TaskRegistry.allTasks().forEach(taskType => {
      taskType.workerConfig = {
        tasks: TaskRegistry.allTasks(),
        sqsUrl: Config.SQS_URL_LAMBDA,
        region: Config.AWS_DEFAULT_REGION
      };
      TaskFactory.registerTask(taskType);
    });
  }
}
