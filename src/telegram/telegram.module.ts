// import { HuggingFaceModule } from '@hf/hf.module';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpenAiModule } from '@open-ai/open-ai.module';
import { StabilityAiModule } from '@stability-ai/stability-ai.module';
import { TelegramChangeImageBgCommand } from '@telegram/commands/telegram.change-image-bg.command';
import { TelegramExplainImageCommand } from '@telegram/commands/telegram.explain-image.command';
import { TelegramFindManipulationCommand } from '@telegram/commands/telegram.find-manipulation.command';
import { TelegramFindToDoCommand } from '@telegram/commands/telegram.find-to-do.command';
import { TelegramGenImageCommand } from '@telegram/commands/telegram.gen-image.command';
import { TelegramSummarizeCommand } from '@telegram/commands/telegram.summarize.command';
import { TelegramTestErrorCommand } from '@telegram/commands/telegram.test-error.command';
import { telegramConfig } from '@telegram/telegram.config';
import { Telegram } from '@telegram/telegram.namespace';
import { TelegramWebhookService } from '@telegram/telegram.webhook.service';
import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';
import { session } from 'telegraf';

@Module({
  imports: [
    ConfigModule.forFeature(telegramConfig),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.get<Telegram.Config>(Telegram.CONFIG);

        return <TelegrafModuleOptions>{
          botName: config.bot.name,
          token: config.bot.token,
          launchOptions: {
            webhook: config.webhook,
          },
          middlewares: [session()],
        };
      },
    }),
    OpenAiModule,
    // HuggingFaceModule,
    StabilityAiModule,
  ],
  providers: [
    {
      provide: Telegram.LOGGER,
      useValue: new Logger(TelegramModule.name),
    },
    TelegramWebhookService,
    // Commands
    TelegramSummarizeCommand,
    TelegramFindToDoCommand,
    TelegramFindManipulationCommand,
    TelegramExplainImageCommand,
    TelegramGenImageCommand,
    TelegramChangeImageBgCommand,
    TelegramTestErrorCommand,
  ],
})
export class TelegramModule {}
