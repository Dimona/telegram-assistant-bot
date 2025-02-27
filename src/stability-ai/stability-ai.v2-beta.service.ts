import { setTimeout as asyncSetTimout } from 'node:timers/promises';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StabilityAi } from '@stability-ai/stability-ai.namespace';
import axios from 'axios';

@Injectable()
export class StabilityAiV2BetaService {
  private readonly config: StabilityAi.Config;

  constructor(
    @Inject(StabilityAi.LOGGER)
    private readonly logger: Logger,
    configService: ConfigService,
  ) {
    this.config = configService.get<StabilityAi.Config>(StabilityAi.CONFIG);
  }

  async generateUltra(prompt: string) {
    this.logger.log('generateImage: StabilityAI Assistant is sending message');

    const response = await axios.postForm(
      `${this.config.url}/${StabilityAi.Scope.V2Beta}/${StabilityAi.SubScope.StableImage}/generate/ultra`,
      axios.toFormData(
        {
          prompt,
          output_format: 'png',
        },
        new FormData(),
      ),
      {
        validateStatus: undefined,
        responseType: 'arraybuffer',
        headers: {
          Accept: 'image/*',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      },
    );

    if (response.status !== 200) {
      this.logger.error(response.data.toString());
      throw new Error(`${response.status}: ${response.data.toString()}`);
    }

    this.logger.log('generateImage: Image is successfully generated');

    return response.data;
  }

  async replaceBackgroundAndRelight(image: Uint8Array, prompt: string): Promise<Buffer> {
    this.logger.log('replaceBackgroundAndRelight: StabilityAI Assistant is sending message');

    const response = await axios.postForm<{ id: string }>(
      `${this.config.url}/${StabilityAi.Scope.V2Beta}/${StabilityAi.SubScope.StableImage}/edit/replace-background-and-relight`,
      axios.toFormData(
        {
          subject_image: image,
          background_prompt: prompt,
          output_format: 'png',
        },
        new FormData(),
      ),
      {
        validateStatus: undefined,
        responseType: 'json',
        headers: {
          Accept: 'image/*',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      },
    );

    if (response.status !== 200) {
      this.logger.error(response.data.toString());
      throw new Error(`${response.status}: ${response.data.toString()}`);
    }
    const responsePoll = await this.pollResults(response.data.id);
    this.logger.log('replaceBackgroundAndRelight: Image is successfully generated');

    return responsePoll.data.result ? Buffer.from(responsePoll.data.result, 'base64') : null;
  }

  private async pollResults(id: string) {
    const handler = async () => {
      return axios.request({
        url: `${this.config.url}/${StabilityAi.Scope.V2Beta}/results/${id}`,
        method: 'GET',
        validateStatus: undefined,
        responseType: 'json',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      });
    };

    for (let retry = 0; retry <= 10; retry++) {
      await asyncSetTimout(2000); // 2 sec
      const response = await handler();
      if (response.status === 202) {
        continue;
      } else if (response.status !== 200) {
        throw new Error(response.data.error);
      }
      return response;
    }

    throw new Error('Operation is cancelled by timeout');
  }
}
