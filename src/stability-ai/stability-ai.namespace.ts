export namespace StabilityAi {
  const scope = 'stability_ai';

  export const CONFIG = `${scope.toUpperCase()}_CONFIG`;

  export const LOGGER = `${scope.toUpperCase()}_LOGGER`;

  export type Config = {
    apiKey: string;
    url: string;
  };

  export enum Scope {
    V2Beta = 'v2beta',
  }

  export enum SubScope {
    StableImage = 'stable-image',
  }
}
