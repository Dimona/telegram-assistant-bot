import { HFService } from '@hf/hf.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Telegram } from '@telegram/telegram.namespace';
import { Ctx, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';

@Injectable()
@Wizard(Telegram.Command.ExplainImage)
export class TelegramExplainImageHFCommand {
  constructor(
    @Inject(Telegram.LOGGER)
    private readonly logger: Logger,
    private readonly hfService: HFService,
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
  async handleText(@Ctx() context: Telegram.MessageContext) {
    const { photo } = context.message;
    if (!photo) {
      await context.scene.leave();
    }
    console.log(context.message.photo);
    try {
      const url = await context.telegram.getFileLink(photo[photo.length - 1].file_id);
      const buffer = await this.download(url.href);

      const result = await this.hfService.captionImage(buffer);
      await context.reply(result);
    } catch (err) {
      this.logger.error(err.stack);
      await context.scene.leave();
      throw err;
    } finally {
      await context.scene.leave();
    }
    // const response = await this.openaiService.explainImage(context.text);
    // const result = response.choices[0].message.content;

    // if (result.length > 0) {
    //   await context.reply(result);
    // }
  }

  private async download(url: string): Promise<ArrayBuffer> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to download image');
    }
    return response.arrayBuffer();
  }
}
