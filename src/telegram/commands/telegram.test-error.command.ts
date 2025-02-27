import { Injectable } from '@nestjs/common';
import { Telegram } from '@telegram/telegram.namespace';
import { Ctx, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';

@Injectable()
@Wizard(Telegram.Command.TestError)
export class TelegramTestErrorCommand {
  @WizardStep(1)
  async enter(@Ctx() context: WizardContext) {
    // await context.reply(``, {
    //   protect_content: true,
    // });
    throw new Error('Something went wrong');
    await context.scene.leave();
  }
}
