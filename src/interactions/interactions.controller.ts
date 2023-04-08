import { Controller, Get, Post } from '@nestjs/common';
import { InteractionsService } from './interactions.service';

@Controller('interactions')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post()
  async sendUsage() {
    await this.interactionsService.addUsage({ aid: 'test-app', scope: ['some', 'scope'] });
    return 'ok';
  }

  @Get()
  async getUsage() {
    // const result = await this.interactionsService.getUsage();
    return 'ok';
  }
}
