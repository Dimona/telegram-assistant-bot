import { Telegraf } from 'telegraf';
import { SceneSessionData, WizardContext } from 'telegraf/scenes';
import { Context } from 'telegraf/src/context';
import SceneContextScene, { SceneSession } from 'telegraf/src/scenes/context';
import { SessionContext } from 'telegraf/src/session';

export namespace Telegram {
  const scope = 'telegram';

  export const CONFIG = `${scope.toUpperCase()}_CONFIG`;

  export const LOGGER = `${scope.toUpperCase()}_LOGGER`;

  export type Client = Telegraf;

  export type Config = {
    bot: {
      name: string;
      token: string;
    };
    webhook: Telegraf.LaunchOptions['webhook'];
  };

  export enum Command {
    Summarize = 'summarize',
    FindToDo = 'findtodo',
    FindManipulation = 'findmanipulation',
    ExplainImage = 'explainimage',
    GenImage = 'generateimage',
    ChangeImageBG = 'changebg',
    TestError = 'testerror',
  }

  export type File = {
    /** Identifier for this file, which can be used to download or reuse the file */
    file_id: string;
    /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
    file_unique_id: string;
    /** File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value. */
    file_size?: number;
    /** File path. Use `https://api.telegram.org/file/bot<token>/<file_path>` to get the file. */
    file_path?: string;
  };

  export type MessageContext = WizardContext & { message: WizardContext['message'] & { photo: File[] } };

  export type CommandContext = Context & { scene: SceneContextScene<SessionContext<SceneSession<SceneSessionData>>> };

  export const ABORT_COMMAND = new Set(['відбій', 'вихід', 'відміна', 'стоп', 'stop', 'exit', 'decline', 'cancel']);

  export const t = Object.freeze({
    noAnswer: 'Нажаль нічого не придумав вам відповісти',
    commandAborted: 'Команда відмінена',
    errors: {
      translation: 'Помилка під час перекладу тексту',
      noImage: 'Не бачу зображення!!!',
      somethingWentWrong: 'Щось пішло не так!!!',
      downloadImage: 'Помилка при завантаженні зображення',
    },
  });
}
