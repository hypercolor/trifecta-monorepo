import { TypedJSON } from 'typedjson';

export type IMappedClass<T> = new(...args: Array<never>) => T;

type GenericObject = Record<string, unknown> | FormData;

type GenericArray<T> = Array<T>;

export class Mapper {

  public static mapInput<T>(json: GenericObject, clazz: IMappedClass<T>): T {
    console.log('Mapping input: ', json, clazz);
    return this.map(json, clazz, 422);
  }

  public static mapOutput<T>(json: GenericObject, clazz: IMappedClass<T>): T {
    return this.map(json, clazz, 500);
  }

  public static mapInputArray<T>(json: GenericArray<GenericObject>, clazz: IMappedClass<T>): Array<T> {
    return this.mapArray(json, clazz, 422);
  }

  private static map<T>(json: GenericObject, clazz: IMappedClass<T>, errorCode: number): T {
    if (!json) {
      throw new Error('Failed to map null or undefined object');
    }
    const serializer = new TypedJSON(clazz, {
      errorHandler: (err: Error) => {
        throw err;
      },
    });
    try {
      console.log('calling serializer.parse: ', json);
      return serializer.parse(json) as T;
    } catch (err: any) {
      // Logger.log(err.stack);
      console.log('failed to map object: ', err, '; ', json);
      throw new Error('Failed to map object: ' + err.toLocaleString());
    }
  }

  private static mapArray<T>(json: GenericArray<GenericObject>, clazz: IMappedClass<T>, errorCode: number): Array<T> {
    if (!json) {
      throw new Error('Failed to map null or undefined array');
    }
    if (json.constructor !== Array) {
      throw new Error('Expected array, found ' + json.constructor.name);
    }
    const serializer = new TypedJSON(clazz, {
      errorHandler: (err: Error) => {
        throw err;
      },
    });
    try {
      return json.map((item: unknown) => serializer.parse(item) as T);
    } catch (err) {
      throw new Error('Failed to map object to array');
    }
  }
}
