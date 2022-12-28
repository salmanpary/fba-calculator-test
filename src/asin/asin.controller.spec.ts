import { Test, TestingModule } from '@nestjs/testing';
import { AsinController } from './asin.controller';

describe('AsinController', () => {
  let controller: AsinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsinController],
    }).compile();

    controller = module.get<AsinController>(AsinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
