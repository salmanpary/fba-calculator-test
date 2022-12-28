import { Test, TestingModule } from '@nestjs/testing';
import { FbmController } from './fbm.controller';

describe('FbmController', () => {
  let controller: FbmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FbmController],
    }).compile();

    controller = module.get<FbmController>(FbmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
