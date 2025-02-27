import { HfInference } from '@huggingface/inference';

export namespace HF {
  const scope = 'hugging_face';

  export const CONFIG = `${scope.toUpperCase()}_CONFIG`;

  export const LOGGER = `${scope.toUpperCase()}_LOGGER`;

  export const CLIENT = `${scope.toUpperCase()}_CLIENT`;

  export type Client = HfInference;

  export type Config = {
    token: string;
  };
}
