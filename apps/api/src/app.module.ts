import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { type AppConfig, appConfig } from './config/app.config';
import { databaseConfig } from './config/database.config';
import { envValidationSchema } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './modules/health/health.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    // ─── Infrastructure ────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, databaseConfig],
      validationSchema: envValidationSchema,
      validationOptions: { abortEarly: false },
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const app = config.getOrThrow<AppConfig>('app');
        return {
          // Express 5 / Nest 11 path syntax (the default '*' triggers a legacy-route warning)
          forRoutes: [{ path: '{*path}', method: RequestMethod.ALL }],
          pinoHttp: {
            level: app.logLevel,
            redact: ['req.headers.authorization', 'req.headers.cookie'],
            autoLogging: { ignore: (req) => req.url?.includes('/health') ?? false },
            transport: app.isProduction
              ? undefined
              : { target: 'pino-pretty', options: { singleLine: true, colorize: true } },
          },
        };
      },
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const { ttl, limit } = config.getOrThrow<AppConfig>('app').throttle;
        return [{ ttl, limit }];
      },
    }),
    DatabaseModule,

    // ─── Features ──────────────────────────────────────────────
    HealthModule,
    TasksModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
