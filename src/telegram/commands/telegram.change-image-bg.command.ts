import { Inject, Injectable, Logger } from '@nestjs/common';
import { OpenAiAssistant } from '@open-ai/open-ai.assistant';
import { Lang } from '@open-ai/open-ai.enums';
import { StabilityAiV2BetaService } from '@stability-ai/stability-ai.v2-beta.service';
import { Telegram } from '@telegram/telegram.namespace';
import { TelegramUtils } from '@telegram/telegram.utils';
import { Ctx, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';

type State = {
  imageUrl?: string;
};

@Injectable()
@Wizard(Telegram.Command.ChangeImageBG)
export class TelegramChangeImageBgCommand {
  constructor(
    @Inject(Telegram.LOGGER)
    private readonly logger: Logger,
    private readonly openAiAssistant: OpenAiAssistant,
    private readonly stabilityAiV2BetaService: StabilityAiV2BetaService,
  ) {}

  @WizardStep(1)
  async handleStep1(@Ctx() context: WizardContext) {
    await context.reply('Завантаж зображення', {
      protect_content: true,
    });
    context.wizard.next();
  }

  @WizardStep(2)
  @On('photo')
  async handleStep2(@Ctx() context: Telegram.MessageContext) {
    const { photo } = context.message;
    if (!photo) {
      await context.reply(Telegram.t.errors.noImage);
      await context.scene.leave();
      await context.scene.enter(Telegram.Command.ExplainImage);
    }
    try {
      const url = await context.telegram.getFileLink(photo[photo.length - 1].file_id);
      (context.wizard.state as State).imageUrl = url.href;
      context.wizard.next();
      await context.reply('Опиши, як замінити задній фон', {
        protect_content: true,
      });
      // const response = await this.openaiAssistant.explainImage(url.href);
      // const result = response.choices[0].message.content;
      // if (result.length > 0) {
      //   await context.reply(response.choices[0].message.content);
      // }
    } catch (err) {
      this.logger.error(err.stack);
      await context.scene.leave();
      throw err;
    }
  }

  @WizardStep(3)
  @On('text')
  async handleStep4(@Ctx() context: WizardContext) {
    if (await TelegramUtils.exit(context)) {
      return;
    }
    const translatedResponse = await this.openAiAssistant.translate(context.text, Lang.EN_US);

    if (!translatedResponse.translation) {
      throw new Error(Telegram.t.errors.translation);
    }

    const srcImage = Buffer.from(await TelegramUtils.download((context.wizard.state as State).imageUrl));

    const image = await this.stabilityAiV2BetaService.replaceBackgroundAndRelight(
      new Uint8Array(srcImage),
      translatedResponse.translation,
    );

    await context.replyWithPhoto({
      source: image,
      filename: 'AI generated file',
    });
    await context.scene.leave();
  }
}
