import { AppModule } from '@app/app.module';
import { GLOBAL_PREFIX } from '@app/constants/app.constants';
import serverlessExpress from '@codegenie/serverless-express';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Handler } from 'aws-lambda';
import { json, urlencoded } from 'body-parser';
import { useContainer } from 'class-validator';

let cachedServer: Handler;

const bootstrapServer = async (): Promise<Handler> => {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));
  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.enableCors();
  const limit = '10mb';
  app.use(json({ limit }));
  app.use(urlencoded({ limit, extended: true }));

  // inject dependencies into custom validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();

  return serverlessExpress(expressApp);
};

export const handler: Handler = async (event, context, callback) => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }

  return cachedServer(event, context, callback);
};
