import OpenAI from 'openai';
import { type ClientOptions } from 'openai/src';

export namespace OpenAi {
  const scope = 'open_ai';

  export const CONFIG = `${scope.toUpperCase()}_CONFIG`;

  export const CLIENT = `${scope.toUpperCase()}_CLIENT`;

  export const LOGGER = `${scope.toUpperCase()}_LOGGER`;

  export type Config = {
    client: ClientOptions;
  };

  export type Client = OpenAI;

  export type TranslationOutput = {
    input: string;
    langSrc: string | null;
    langTrgt: string;
    translation: string | null;
  };
}
