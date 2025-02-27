import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { stabilityAiConfig } from '@stability-ai/stability-ai.config';
import { StabilityAi } from '@stability-ai/stability-ai.namespace';
import { StabilityAiV2BetaService } from '@stability-ai/stability-ai.v2-beta.service';

@Module({
  imports: [ConfigModule.forFeature(stabilityAiConfig)],
  providers: [
    {
      provide: StabilityAi.LOGGER,
      useValue: new Logger(StabilityAiModule.name),
    },
    StabilityAiV2BetaService,
  ],
  exports: [StabilityAiV2BetaService],
})
export class StabilityAiModule {}
