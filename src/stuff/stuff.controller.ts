import { Controller, Get, Post } from '@nestjs/common';
import { StuffService } from './stuff.service';

@Controller()
export class StuffController {
  constructor(private readonly appService: StuffService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/usage')
  sendUsage() {
    return 'ok';
  }

  @Get('/usage')
  getUsage() {
    return 'ok-ok';
  }
}
