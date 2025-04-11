import { optionalBooleanEnv, optionalEnv, optionalIntEnv, requiredEnv } from '@hypercolor/envconfig';

export class Config {
  @requiredEnv public static AWS_DEFAULT_REGION: string;
  @requiredEnv public static SQS_URL_LAMBDA: string;
  @requiredEnv public static POSTGRES_DATABASE_NAME: string;

  @optionalEnv public static PAPERTRAIL_HOST?: string;
  @optionalEnv public static PAPERTRAIL_PORT?: string;

  @optionalIntEnv(10) public static DATABASE_CONNECTION_POOL_SIZE: number;
  @optionalIntEnv(1) public static WORKER_CONCURRENCY: number;
  @optionalIntEnv(1) public static WORKER_POLLING_WAIT_TIME_MS: number;
  @optionalIntEnv(1) public static WORKER_BATCH_SIZE: number;

  @optionalIntEnv(50) public static FIREBASE_PUSH_BATCH_SIZE: number;

  @optionalBooleanEnv public static WORKER_VERBOSE: boolean;
  @optionalBooleanEnv public static WORKER_DEBUG: boolean;
  @optionalIntEnv(5432) public static DATABASE_PORT: number;
  @optionalIntEnv(25000) public static DATABASE_CLIENT_TIMEOUT_MS: number;

  public static IS_LOCAL: boolean = process.env.IS_LOCAL ? process.env.IS_LOCAL === 'true' : false;
}
