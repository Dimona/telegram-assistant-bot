import { AppController } from '@app/controllers/app.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from '@telegram/telegram.module';

@Module({
  imports: [ConfigModule.forRoot(), TelegramModule],
  controllers: [AppController],
})
export class AppModule {}
