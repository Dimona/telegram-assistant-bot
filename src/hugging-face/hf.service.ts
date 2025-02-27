import { HF } from '@hf/hf.namespace';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HFService {
  constructor(
    @Inject(HF.LOGGER)
    private readonly logger: Logger,

    @Inject(HF.CLIENT)
    private readonly client: HF.Client,
  ) {}

  async captionImage(imageBuffer: ArrayBuffer) {
    this.logger.log('Image is sending to the Hugging Face API for captioning');
    const result = await this.client.imageToText({
      model: 'Salesforce/blip-image-captioning-large',
      data: imageBuffer,
    });
    this.logger.log('Image is captioned successfully');

    return result.generated_text || 'Зображення не вдалося розпізнати';
  }

  async translate(text: string, from: string, to: string) {
    this.logger.log('Text is sending on the Hugging Face API for translation');
    const result = await this.client.translation({
      model: 'Xenova/mbart-large-50-many-to-one-mmt',
      inputs: text,
      parameters: {
        src_lang: from,
        tgt_lang: to,
      },
    });
    this.logger.log('Text is successfully translated');

    return result;
  }

  async genImage(text: string): Promise<string> {
    // const translatedText = await this.translate(text, 'uk_UA', 'en_US');
    // console.log(translatedText);

    this.logger.log('Image is generating on the Hugging Face API');
    // @ts-ignore
    const result: string = await this.client.textToImage(
      {
        model: 'black-forest-labs/FLUX.1-dev',
        inputs: text /* translatedText.translation_text */,
      },
      // @ts-ignore
      { outputType: 'url' },
    );
    this.logger.log('Image is successfully generated');
    // console.log(result);

    // Important!!!! Returns not url. It's a base64 string
    return result;
  }
}
