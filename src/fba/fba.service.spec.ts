import { Test, TestingModule } from '@nestjs/testing';
import { FbaService } from './fba.service';

describe('FbaService', () => {
  let service: FbaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FbaService],
    }).compile();

    service = module.get<FbaService>(FbaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
