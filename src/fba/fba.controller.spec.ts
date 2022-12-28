import { Test, TestingModule } from '@nestjs/testing';
import { FbaController } from './fba.controller';

describe('FbaController', () => {
  let controller: FbaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FbaController],
    }).compile();

    controller = module.get<FbaController>(FbaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
