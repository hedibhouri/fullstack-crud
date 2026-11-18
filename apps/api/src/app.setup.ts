import { type INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import type { AppConfig } from './config/app.config';

export const API_PREFIX = 'api';

/**
 * Applies global middleware, pipes, filters and docs.
 * Shared by `main.ts` and the e2e tests so both run the exact same pipeline.
 */
export function setupApp(app: INestApplication): void {
  const config = app.get(ConfigService).getOrThrow<AppConfig>('app');

  app.setGlobalPrefix(API_PREFIX);
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: config.corsOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  app.enableShutdownHooks();

  if (config.swaggerEnabled) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Tasks API')
        .setDescription('REST API for the Tasks CRUD application')
        .setVersion('1.0')
        .build(),
    );
    SwaggerModule.setup(`${API_PREFIX}/docs`, app, document);
  }
}
