import { Injectable } from '@nestjs/common';
import { Telegram } from '@telegram/telegram.namespace';
import { Wizard, WizardStep } from 'nestjs-telegraf';

@Injectable()
@Wizard(Telegram.Command.TestError)
export class TelegramTestErrorCommand {
  @WizardStep(1)
  async handleStep1() {
    throw new Error(Telegram.t.errors.somethingWentWrong);
  }
}
