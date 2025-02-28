import { Injectable } from '@nestjs/common';
import { OpenAiAssistant } from '@open-ai/open-ai.assistant';
import { Telegram } from '@telegram/telegram.namespace';
import { TelegramUtils } from '@telegram/telegram.utils';
import { Ctx, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';

@Injectable()
@Wizard(Telegram.Command.FindManipulation)
export class TelegramFindManipulationCommand {
  constructor(private readonly openaiService: OpenAiAssistant) {}

  @WizardStep(1)
  async handleStep1(@Ctx() context: WizardContext) {
    await context.reply('Дай, будь ласка, частину переписки, де я маю відшукати прямі і непрямі маніпуляції', {
      protect_content: true,
    });
    context.wizard.next();
  }

  @WizardStep(2)
  @On('text')
  async handleStep2(@Ctx() context: WizardContext) {
    if (await TelegramUtils.exit(context)) {
      return;
    }
    const response = await this.openaiService.findManipulation(context.text);
    const result = response.choices[0].message.content;

    await context.reply(result.length > 0 ? result : Telegram.t.noAnswer);
    await context.scene.leave();
  }
}
