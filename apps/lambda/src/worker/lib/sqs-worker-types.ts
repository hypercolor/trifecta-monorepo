import {ITask} from "./task";

export interface ILambdaSubmitterConfig extends ILambdaCommon {
  tasks: Array<ITaskClass>;
}

interface ILambdaCommon {
  sqsUrl: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  region?: string;

}

export interface ITaskClass {
  name: string;
  workerConfig: ILambdaSubmitterConfig;
  new (): ITask;
}

export interface ITaskResult {
  info?: string;
  error?: any;
}
