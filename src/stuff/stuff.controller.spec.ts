import { Test, TestingModule } from '@nestjs/testing';
import { StuffController } from './stuff.controller';
import { StuffService } from './stuff.service';

describe('StuffController', () => {
  let appController: StuffController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [StuffController],
      providers: [StuffService],
    }).compile();

    appController = app.get<StuffController>(StuffController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
