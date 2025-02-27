import { Inject, Injectable, Logger } from '@nestjs/common';
import { OpenAiAssistant } from '@open-ai/open-ai.assistant';
import { Telegram } from '@telegram/telegram.namespace';
import { Ctx, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';

@Injectable()
@Wizard(Telegram.Command.ExplainImage)
export class TelegramExplainImageCommand {
  constructor(
    @Inject(Telegram.LOGGER)
    private readonly logger: Logger,
    private readonly openaiAssistant: OpenAiAssistant,
  ) {}

  @WizardStep(1)
  async enter(@Ctx() context: WizardContext) {
    await context.reply('Завантаж зображення', {
      protect_content: true,
    });
    context.wizard.next();
  }

  @WizardStep(2)
  @On('photo')
  async handlePhoto(@Ctx() context: Telegram.MessageContext) {
    const { photo } = context.message;
    if (!photo) {
      await context.scene.leave();
    }
    try {
      const url = await context.telegram.getFileLink(photo[photo.length - 1].file_id);

      const response = await this.openaiAssistant.explainImage(url.href);
      const result = response.choices[0].message.content;
      if (result.length > 0) {
        await context.reply(response.choices[0].message.content);
      }
    } catch (err) {
      this.logger.error(err.stack);
      await context.scene.leave();
      throw err;
    } finally {
      await context.scene.leave();
    }
  }
}
