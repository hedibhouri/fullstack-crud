import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { API_PREFIX, setupApp } from './app.setup';
import type { AppConfig } from './config/app.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  setupApp(app);

  const { port, swaggerEnabled } = app.get(ConfigService).getOrThrow<AppConfig>('app');
  await app.listen(port);

  const logger = app.get(Logger);
  logger.log(`API listening on http://localhost:${port}/${API_PREFIX}`);
  if (swaggerEnabled) logger.log(`Swagger docs on http://localhost:${port}/${API_PREFIX}/docs`);
}

void bootstrap();
