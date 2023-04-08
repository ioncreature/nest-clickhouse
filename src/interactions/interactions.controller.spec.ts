import { Test, TestingModule } from '@nestjs/testing';
import { InteractionsController } from './interactions.controller';
import { InteractionsService } from './interactions.service';

describe('StuffController', () => {
  let appController: InteractionsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [InteractionsController],
      providers: [InteractionsService],
    }).compile();

    appController = app.get<InteractionsController>(InteractionsController);
  });

  describe('/usage', () => {
    it('should return "ok" on GET', () => {
      expect(appController.getUsage()).toBe('ok');
    });
  });
});
