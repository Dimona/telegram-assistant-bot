import { Controller, Get, HttpStatus, Post, Request } from '@nestjs/common';

@Controller()
export class AppController {
  @Post('telegram/webhook')
  handleTelegramWebhook(@Request() req) {
    console.log(req);
    return {};
  }

  @Get()
  pingPong() {
    return {
      status: HttpStatus.OK,
      handshake: true,
    };
  }
}
