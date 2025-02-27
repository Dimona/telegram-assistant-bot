import { hfConfig } from '@hf/hf.config';
import { HF } from '@hf/hf.namespace';
import { HFService } from '@hf/hf.service';
import { HfInference } from '@huggingface/inference';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forFeature(hfConfig)],
  providers: [
    {
      provide: HF.LOGGER,
      useValue: new Logger(HuggingFaceModule.name),
    },
    {
      provide: HF.CLIENT,
      useFactory: (configService: ConfigService) => new HfInference(configService.get<HF.Config>(HF.CONFIG).token),
      inject: [ConfigService],
    },
    HFService,
  ],
  exports: [HFService],
})
export class HuggingFaceModule {}
