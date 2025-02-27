import * as process from 'node:process';

import { registerAs } from '@nestjs/config';
import { Telegram } from '@telegram/telegram.namespace';

export const telegramConfig = registerAs(
  Telegram.CONFIG,
  () =>
    <Telegram.Config>{
      bot: {
        name: 'my_not_stupid_bot',
        token: process.env.TELEGRAM_BOT_TOKEN,
      },
      webhook: {
        domain: process.env.TELEGRAM_WEBHOOK_DOMAIN,
        path: process.env.TELEGRAM_WEBHOOK_PATH,
      },
    },
);
