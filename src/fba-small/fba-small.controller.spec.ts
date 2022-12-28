import { Test, TestingModule } from '@nestjs/testing';
import { FbaSmallController } from './fba-small.controller';

describe('FbaSmallController', () => {
  let controller: FbaSmallController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FbaSmallController],
    }).compile();

    controller = module.get<FbaSmallController>(FbaSmallController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
