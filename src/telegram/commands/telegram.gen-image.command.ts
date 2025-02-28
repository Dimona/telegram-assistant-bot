import { Injectable } from '@nestjs/common';
import { OpenAiAssistant } from '@open-ai/open-ai.assistant';
import { Lang } from '@open-ai/open-ai.enums';
import { StabilityAiV2BetaService } from '@stability-ai/stability-ai.v2-beta.service';
import { Telegram } from '@telegram/telegram.namespace';
import { TelegramUtils } from '@telegram/telegram.utils';
import { Ctx, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';

@Injectable()
@Wizard(Telegram.Command.GenImage)
export class TelegramGenImageCommand {
  constructor(
    private readonly openAiAssistant: OpenAiAssistant,
    private readonly stabilityAiV2BetaService: StabilityAiV2BetaService,
  ) {}

  @WizardStep(1)
  async handleStep1(@Ctx() context: WizardContext) {
    await context.reply('Опиши, яке зображення згенерувати', {
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
    const translatedResponse = await this.openAiAssistant.translate(context.text, Lang.EN_US);

    const image = await this.stabilityAiV2BetaService.generateUltra(translatedResponse.translation);

    if (!image) {
      await context.reply(Telegram.t.noAnswer);
      return;
    }

    await context.replyWithPhoto({
      source: Buffer.from(image),
      filename: 'AI generated file',
    });
    await context.scene.leave();
  }
}
