import { Controller, Get, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  pingPong() {
    return {
      status: HttpStatus.OK,
      handshake: true,
    };
  }
}
