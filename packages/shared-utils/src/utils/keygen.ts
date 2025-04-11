import {AnotherTest} from "shared-types";

const anotherTest = new AnotherTest(1, 'John Doe');
console.log('anotherTest: ', anotherTest);

export class Keygen {
  /**
   * Return a unique identifier with the given `len`.
   *
   *     utils.uid(10);
   *     // => "FDaS435D2z"
   *
   * @param {Number} len
   * @return {String}
   * @api private
   */
  public static uid(len: number): string {
    const buf: string[] = [];
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = chars.length;

    for (let i = 0; i < len; ++i) {
      buf.push(chars[getRandomInt(0, length - 1)]);
    }

    return buf.join('');
  }

  /**
   * Return a unique identifier with the given `len`.
   *
   *     utils.uid(10);
   *     // => "FDaS435D2z"
   *
   * @param {Number} len
   * @return {String}
   * @api private
   */
  public static hexUid(len: number): string {
    const buf: string[] = [];
    const chars = 'ABCDEF0123456789';
    const length = chars.length;

    for (let i = 0; i < len; ++i) {
      buf.push(chars[getRandomInt(0, length - 1)]);
    }

    return buf.join('');
  }
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
