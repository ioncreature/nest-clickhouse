import { Controller, Get } from '@nestjs/common';
import { StuffService } from './stuff.service';

@Controller()
export class StuffController {
  constructor(private readonly appService: StuffService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
