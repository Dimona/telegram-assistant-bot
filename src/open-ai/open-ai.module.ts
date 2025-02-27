import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpenAiAssistant } from '@open-ai/open-ai.assistant';
import { openAiConfig } from '@open-ai/open-ai.config';
import { OpenAi } from '@open-ai/open-ai.namespace';
import OpenAI from 'openai';

@Module({
  imports: [ConfigModule.forFeature(openAiConfig)],
  providers: [
    {
      provide: OpenAi.LOGGER,
      useValue: new Logger(OpenAiModule.name),
    },
    {
      provide: OpenAi.CLIENT,
      useFactory: (configService: ConfigService) => new OpenAI(configService.get<OpenAi.Config>(OpenAi.CONFIG).client),
      inject: [ConfigService],
    },
    OpenAiAssistant,
  ],
  exports: [OpenAiAssistant],
})
export class OpenAiModule {}
