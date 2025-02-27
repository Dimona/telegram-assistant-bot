import * as process from 'node:process';

import { HF } from '@hf/hf.namespace';
import { registerAs } from '@nestjs/config';

export const hfConfig = registerAs(
  HF.CONFIG,
  () =>
    <HF.Config>{
      token: process.env.HF_TOKEN,
    },
);
