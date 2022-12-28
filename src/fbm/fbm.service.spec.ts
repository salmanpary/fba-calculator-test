import { Test, TestingModule } from '@nestjs/testing';
import { FbmService } from './fbm.service';

describe('FbmService', () => {
  let service: FbmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FbmService],
    }).compile();

    service = module.get<FbmService>(FbmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
