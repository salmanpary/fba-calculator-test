import { Test, TestingModule } from '@nestjs/testing';
import { FbaSmallService } from './fba-small.service';

describe('FbaSmallService', () => {
  let service: FbaSmallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FbaSmallService],
    }).compile();

    service = module.get<FbaSmallService>(FbaSmallService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
