import { Inject, Injectable, Logger, UseFilters } from '@nestjs/common';
import { TelegramExceptionFilter } from '@telegram/telegram.exception-filter';
import { Telegram } from '@telegram/telegram.namespace';
import { Command, Ctx, Update } from 'nestjs-telegraf';

@Update()
@Injectable()
@UseFilters(TelegramExceptionFilter)
export class TelegramWebhookService {
  constructor(
    @Inject(Telegram.LOGGER)
    private readonly logger: Logger,
  ) {}

  private async handleCommand(command: Telegram.Command, context: Telegram.CommandContext) {
    this.logger.log(`Command ${command} is consumed`);
    try {
      await context.scene.enter(command);
    } catch (err) {
      this.logger.error(err.stack);
      throw err;
    }
  }

  @Command(Telegram.Command.Summarize)
  async handleSummarize(@Ctx() context: Telegram.CommandContext) {
    await this.handleCommand(Telegram.Command.Summarize, context);
  }

  @Command(Telegram.Command.FindToDo)
  async handleFindToDo(@Ctx() context: Telegram.CommandContext) {
    await this.handleCommand(Telegram.Command.FindToDo, context);
  }

  @Command(Telegram.Command.FindManipulation)
  async handleFindManipulation(@Ctx() context: Telegram.CommandContext) {
    await this.handleCommand(Telegram.Command.FindManipulation, context);
  }

  @Command(Telegram.Command.ExplainImage)
  async handleExplainImage(@Ctx() context: Telegram.CommandContext) {
    await this.handleCommand(Telegram.Command.ExplainImage, context);
  }

  @Command(Telegram.Command.GenImage)
  async handleGenImage(@Ctx() context: Telegram.CommandContext) {
    await this.handleCommand(Telegram.Command.GenImage, context);
  }

  @Command(Telegram.Command.ChangeImageBG)
  async handleChangeImageBG(@Ctx() context: Telegram.CommandContext) {
    await this.handleCommand(Telegram.Command.ChangeImageBG, context);
  }

  @Command(Telegram.Command.TestError)
  async handleTestError(@Ctx() context: Telegram.CommandContext) {
    await this.handleCommand(Telegram.Command.TestError, context);
  }
}
