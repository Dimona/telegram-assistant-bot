import * as process from 'node:process';

import { registerAs } from '@nestjs/config';
import { OpenAi } from '@open-ai/open-ai.namespace';

export const openAiConfig = registerAs(
  OpenAi.CONFIG,
  () =>
    <OpenAi.Config>{
      client: {
        apiKey: process.env.OPEN_AI_API_KEY,
        timeout: 20 * 1000, // 20 sec,
      },
    },
);
