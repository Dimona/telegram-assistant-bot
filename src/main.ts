import { AppModule } from '@app/app.module';
import { DEFAULT_PORT, GLOBAL_PREFIX } from '@app/constants/app.constants';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Telegram } from '@telegram/telegram.namespace';
import { json, urlencoded } from 'body-parser';
import { useContainer } from 'class-validator';
import { getBotToken } from 'nestjs-telegraf';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));
  // app.setGlobalPrefix(GLOBAL_PREFIX);
  app.enableCors();
  const limit = '10mb';
  app.use(json({ limit }));
  app.use(urlencoded({ limit, extended: true }));

  // inject dependencies into custom validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const configService = app.get(ConfigService);
  const port = (configService.get<number>('PORT') as number) || DEFAULT_PORT;
  const telegramConfig = configService.get<Telegram.Config>(Telegram.CONFIG);

  const bot = app.get(getBotToken());

  app.use(bot.webhookCallback(telegramConfig.webhook.path));

  await app.listen(port, () => {
    Logger.log(`Server is listening on ${port} port.`, 'NestApplication');
  });
};

bootstrap();
