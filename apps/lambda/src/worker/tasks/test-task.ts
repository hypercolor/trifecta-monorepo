import {RetryableTask} from '../lib/task';
import { jsonMember, jsonObject } from 'typedjson';
import { Logger } from '../../util/logger';

@jsonObject
export class TestTask extends RetryableTask {
  @jsonMember public message?: string;

  public async run() {
    if (this.message) {
      Logger.log('TestTask.run() - message: ' + this.message);
    }

    return {
      info: 'Test task invoked successfully',
    }
  }
}
