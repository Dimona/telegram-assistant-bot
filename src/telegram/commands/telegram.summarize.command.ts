import { Injectable } from '@nestjs/common';
import { OpenAiAssistant } from '@open-ai/open-ai.assistant';
import { Telegram } from '@telegram/telegram.namespace';
import { Ctx, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';

@Injectable()
@Wizard(Telegram.Command.Summarize)
export class TelegramSummarizeCommand {
  constructor(private readonly openaiService: OpenAiAssistant) {}

  @WizardStep(1)
  async enter(@Ctx() context: WizardContext) {
    await context.reply('Дай, будь ласка, частину переписки', {
      protect_content: true,
    });
    context.wizard.next();
  }

  @WizardStep(2)
  @On('text')
  async handleText(@Ctx() context: WizardContext) {
    if (context.text.startsWith('/')) {
      await context.scene.leave();
      return;
    }
    const response = await this.openaiService.summarize(context.text);
    const result = response.choices[0].message.content;

    if (result.length > 0) {
      await context.reply(result);
    }
    await context.scene.leave();
  }
}
