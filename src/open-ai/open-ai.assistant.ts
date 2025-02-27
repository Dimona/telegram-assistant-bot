import { Inject, Injectable, Logger } from '@nestjs/common';
import { Lang } from '@open-ai/open-ai.enums';
import { OpenAi } from '@open-ai/open-ai.namespace';
import { explainImageSystem, explainImageUser } from '@open-ai/prompts/explain-image.prompt';
import { findManipulationPrompt } from '@open-ai/prompts/find-manipulation.prompt';
import { findToDoPrompt } from '@open-ai/prompts/find-to-do.prompt';
import { summarizePrompt } from '@open-ai/prompts/summarize.prompt';
import { translateUserPrompt } from '@open-ai/prompts/translate.prompt';
import { ChatCompletion } from 'openai/src/resources/chat/completions/completions';

@Injectable()
export class OpenAiAssistant {
  constructor(
    @Inject(OpenAi.CLIENT)
    private readonly client: OpenAi.Client,
    @Inject(OpenAi.LOGGER)
    private readonly logger: Logger,
  ) {}

  async summarize(text: string): Promise<ChatCompletion> {
    this.logger.log('summarize: AI Assistant is sending message');
    const response = await this.client.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: summarizePrompt(text),
        },
      ],
      model: 'gpt-4o-mini',
    });
    this.logger.log('summarize: AI Assistant processed message');

    return response;
  }

  async findToDo(text: string): Promise<ChatCompletion> {
    this.logger.log('findToDo: AI Assistant is sending message');
    const response = await this.client.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: findToDoPrompt(text),
        },
      ],
      model: 'gpt-4o-mini',
    });
    this.logger.log('findToDo: AI Assistant processed message');

    return response;
  }

  async findManipulation(text: string): Promise<ChatCompletion> {
    this.logger.log('findManipulation: AI Assistant is sending message');
    const response = await this.client.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: findManipulationPrompt(text),
        },
      ],
      model: 'gpt-4o-mini',
    });
    // const response: ChatCompletion = JSON.parse(
    //   '{"id":"chatcmpl-B4olvgjLf3cjUvV3kqPtbJnnrQGYK","object":"chat.completion","created":1740488179,"model":"gpt-4o-mini-2024-07-18","choices":[{"index":0,"message":{"role":"assistant","content":"### Короткий огляд переписки\\n\\n**Основні твердження:**\\n\\n1. **Замовлення їжі:**\\n   - Пані Кохана спочатку перерахувала, що замовила для Паші, Марини, Саші та Дєні. Вона зазначила їхні замовлення й напої.\\n   \\n2. **Посилка:**\\n   - Пані Кохана повідомила про готовність посилки для Дмітра (номери, адреса та пароль для отримання).\\n   \\n3. **Список покупок:**\\n   - Пані Кохана надіслала детальний список продуктів, які потрібно купити, включаючи овочі, фрукти та інші продукти.\\n   \\n4. **Футбольні новини:**\\n   - Дмітр повідомив про перемогу Ліверпуля.\\n\\n5. **Обговорення планів:**\\n   - Пані Кохана запитала, коли Дмітр зможе забрати Пашу, і розпитувала про його обід та графік футболу.\\n   \\n6. **Співпраця з Нікітою:**\\n   - Обговорювали доступ до Google Drive, де Пані Кохана надіслала матеріали для Нікіти. Дмітр нагадав, що потрібно правильно надати доступ, щоб Нікіта міг користуватися матеріалами.\\n\\n### Глобальний огляд обговорення:\\n\\nПереписка стосується організації повсякденних справ сім\'ї, включаючи:\\n- Замовлення їжі та покупок.\\n- Обговорення планів на день, таких як забір дитини зі школи та харчування.\\n- Операційні питання, пов\'язані з отриманням посилки та доступом до навчальних матеріалів для Нікіти.\\n\\nЦе свідчить про повсякденні турботи і комунікацію в родині, де кожен виконує свої ролі у спільних обов\'язках.","refusal":null},"logprobs":null,"finish_reason":"stop"}],"usage":{"prompt_tokens":2077,"completion_tokens":451,"total_tokens":2528,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":0,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}},"service_tier":"default","system_fingerprint":"fp_709714d124"}',
    // );
    this.logger.log('findManipulation: AI Assistant processed message');

    // console.log(response);
    // console.log(JSON.stringify(response));

    return response;
  }

  async explainImage(fileUrl: string): Promise<ChatCompletion> {
    this.logger.log('explainImage: AI Assistant is sending message');
    const response = await this.client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: explainImageSystem,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: explainImageUser,
            },
            {
              type: 'image_url',
              image_url: {
                url: fileUrl,
              },
            },
          ],
        },
      ],
      model: 'gpt-4o-mini',
    });
    this.logger.log('explainImage: AI Assistant processed message');

    return response;
  }

  async genImage(text: string) {
    this.logger.log('genImage: AI Assistant is sending message');
    const translatedResponse = await this.translate(text, Lang.EN_US);

    if (!translatedResponse.translation) {
      throw new Error('Text was not translated');
    }

    const response = await this.client.images.generate({
      prompt: translatedResponse.translation,
      size: '512x512',
      response_format: 'b64_json',
    });
    this.logger.log('genImage: Image is successfully generated');

    return response;
  }

  async translate(text: string, targetLanguage: string): Promise<OpenAi.TranslationOutput | null> {
    try {
      this.logger.log('translate: AI Assistant is sending message');
      const result = await this.client.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: translateUserPrompt(text, targetLanguage),
          },
        ],
        model: 'gpt-4o-mini',
      });
      this.logger.log('translate: Text was successfully translated');

      return result
        ? JSON.parse(result.choices[0].message.content)
        : {
            langSrc: null,
            langTrgt: targetLanguage,
            input: text,
            translation: null,
          };
    } catch (e) {
      this.logger.error(e.stack);
    }
  }
}
