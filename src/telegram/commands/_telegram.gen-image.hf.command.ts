import { HFService } from '@hf/hf.service';
import { Injectable } from '@nestjs/common';
import { Telegram } from '@telegram/telegram.namespace';
import { Ctx, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';

@Injectable()
@Wizard(Telegram.Command.GenImage)
export class TelegramGenImageHFCommand {
  constructor(private readonly hfService: HFService) {}

  @WizardStep(1)
  async enter(@Ctx() context: WizardContext) {
    await context.reply('Опиши, яке зображення згенерувати', {
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
    const imageBase64 = await this.hfService.genImage(context.text);

    await context.replyWithPhoto({
      source: Buffer.from(imageBase64.replace('data:image/jpeg;base64,', ''), 'base64'),
      filename: 'AI generated file',
    });
    // console.log(response);
    // const result = /* response.choices[0].message.content; */
    // if (result.length > 0) {
    //   await context.reply(result);
    // }
    await context.scene.leave();
  }
}
