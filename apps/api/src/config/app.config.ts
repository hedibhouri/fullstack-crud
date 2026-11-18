import { registerAs } from '@nestjs/config';
import { Environment } from './env.validation';

export interface AppConfig {
  env: Environment;
  isProduction: boolean;
  port: number;
  corsOrigins: string[];
  logLevel: string;
  swaggerEnabled: boolean;
  throttle: { ttl: number; limit: number };
}

const toBool = (value: string | undefined, fallback: boolean): boolean =>
  value === undefined ? fallback : value === 'true';

export const appConfig = registerAs('app', (): AppConfig => {
  const env = (process.env.NODE_ENV as Environment | undefined) ?? Environment.Development;
  const isProduction = env === Environment.Production;

  return {
    env,
    isProduction,
    port: Number(process.env.PORT ?? 3000),
    corsOrigins: (process.env.CORS_ORIGINS ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    logLevel: process.env.LOG_LEVEL ?? 'info',
    swaggerEnabled: toBool(process.env.SWAGGER_ENABLED, !isProduction),
    throttle: {
      ttl: Number(process.env.THROTTLE_TTL ?? 60_000),
      limit: Number(process.env.THROTTLE_LIMIT ?? 100),
    },
  };
});
