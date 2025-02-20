import { Server } from 'http';

import { AppModule } from '@app/app.module';
import { GLOBAL_PREFIX } from '@app/constants/app.constants';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import { json, urlencoded } from 'body-parser';
import { useContainer } from 'class-validator';
import { default as express } from 'express';

let cachedServer: Server;

const bootstrapServer = async (): Promise<Server> => {
  const expressApp = express();
  expressApp.use(eventContext());
  expressApp.set('etag', false);

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

  return createServer(expressApp);
};

export const handler: APIGatewayProxyHandler = async (event, context) => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }

  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
