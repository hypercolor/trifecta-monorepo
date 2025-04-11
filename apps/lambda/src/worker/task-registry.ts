import { ITaskClass } from './lib/sqs-worker-types';
import { TestTask } from './tasks/test-task';

export class TaskRegistry {
  public static allTasks(): ITaskClass[] {
    return [
      TestTask,
    ];
  }
}
