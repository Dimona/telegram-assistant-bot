import { Telegram } from '@telegram/telegram.namespace';
import { WizardContext } from 'telegraf/scenes';

export class TelegramUtils {
  static async download(url: string): Promise<ArrayBuffer> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(Telegram.t.errors.downloadImage);
    }
    return response.arrayBuffer();
  }

  static async exit(context: Telegram.CommandContext | WizardContext): Promise<boolean> {
    if (Telegram.ABORT_COMMAND.has(context.text)) {
      await context.reply(Telegram.t.commandAborted);
      await context.scene.leave();

      return true;
    }

    return false;
  }
}
