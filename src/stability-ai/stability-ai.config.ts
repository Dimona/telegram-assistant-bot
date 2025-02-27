import * as process from 'node:process';

import { registerAs } from '@nestjs/config';
import { StabilityAi } from '@stability-ai/stability-ai.namespace';

export const stabilityAiConfig = registerAs(
  StabilityAi.CONFIG,
  () =>
    <StabilityAi.Config>{
      apiKey: process.env.STABILITY_AI_API_KEY,
      url: 'https://api.stability.ai',
    },
);
