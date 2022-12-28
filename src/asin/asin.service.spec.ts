import { Test, TestingModule } from '@nestjs/testing';
import { AsinService } from './asin.service';

describe('AsinService', () => {
  let service: AsinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsinService],
    }).compile();

    service = module.get<AsinService>(AsinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
