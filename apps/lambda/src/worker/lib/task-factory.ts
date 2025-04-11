import { Mapper } from "shared-types";
import {ITaskClass} from './sqs-worker-types';
import { ITask } from './task';

export class TaskFactory {
  private static taskTypes: { [key: string]: ITaskClass } = {};

  public static registerTask(taskType: ITaskClass) {
    this.taskTypes[taskType.name] = taskType;
  }

  public static async build(type: string, parameters?: { [key: string]: any }, verbose?: boolean): Promise<ITask> {
    type = type.trim();

    // if (verbose) {
    //   Logger.log('TaskFactory: Building task: ' + type + ' from parameters: ' + parameters);
    // }

    const taskType = this.taskTypes[type];

    if (!taskType) {
      throw new Error('Invalid task type: ' + type);
    }

    // if (verbose) {
    //   Logger.log('TaskFactory: Got taskType: ', taskType);
    // }

    const task = Mapper.mapInput(parameters || {}, taskType);

    // if (verbose) {
    //   Logger.log('TaskFactory: Built task: ', task);
    // }
    return task;
  }
}
