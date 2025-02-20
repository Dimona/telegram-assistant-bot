import { AppModule } from '@app/app.module';
import { DEFAULT_PORT, GLOBAL_PREFIX } from '@app/constants/app.constants';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'body-parser';
import { useContainer } from 'class-validator';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));
  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.enableCors();
  const limit = '10mb';
  app.use(json({ limit }));
  app.use(urlencoded({ limit, extended: true }));

  // inject dependencies into custom validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const port = (app.get(ConfigService).get<number>('PORT') as number) || DEFAULT_PORT;

  await app.listen(port, () => {
    Logger.log(`Server is listening on ${port} port.`, 'NestApplication');
  });
};

bootstrap();
