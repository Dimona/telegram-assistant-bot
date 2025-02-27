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

  @Command(Telegram.Command.Summarize)
  async handleSummarize(@Ctx() context: Telegram.CommandContext) {
    this.logger.log(`Command ${Telegram.Command.Summarize} is consumed`);
    await context.scene.enter(Telegram.Command.Summarize);
  }

  @Command(Telegram.Command.FindToDo)
  async handleFindToDo(@Ctx() context: Telegram.CommandContext) {
    this.logger.log(`Command ${Telegram.Command.FindToDo} is consumed`);
    await context.scene.enter(Telegram.Command.FindToDo);
  }

  @Command(Telegram.Command.FindManipulation)
  async handleFindManipulation(@Ctx() context: Telegram.CommandContext) {
    this.logger.log(`Command ${Telegram.Command.FindManipulation} is consumed`);
    await context.scene.enter(Telegram.Command.FindManipulation);
  }

  @Command(Telegram.Command.ExplainImage)
  async handleExplainImage(@Ctx() context: Telegram.CommandContext) {
    this.logger.log(`Command ${Telegram.Command.ExplainImage} is consumed`);
    await context.scene.enter(Telegram.Command.ExplainImage);
  }

  @Command(Telegram.Command.GenImage)
  async handleGenImage(@Ctx() context: Telegram.CommandContext) {
    this.logger.log(`Command ${Telegram.Command.GenImage} is consumed`);
    await context.scene.enter(Telegram.Command.GenImage);
  }

  @Command(Telegram.Command.ChangeImageBG)
  async handleChangeImageBG(@Ctx() context: Telegram.CommandContext) {
    this.logger.log(`Command ${Telegram.Command.ChangeImageBG} is consumed`);
    await context.scene.enter(Telegram.Command.ChangeImageBG);
  }

  @Command(Telegram.Command.TestError)
  async handleTestError(@Ctx() context: Telegram.CommandContext) {
    this.logger.log(`Command ${Telegram.Command.TestError} is consumed`);
    await context.scene.enter(Telegram.Command.TestError);
  }
}
