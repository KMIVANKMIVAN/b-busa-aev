import { Test, TestingModule } from '@nestjs/testing';
import { SemillasService } from './semillas.service';

describe('SemillasService', () => {
  let service: SemillasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SemillasService],
    }).compile();

    service = module.get<SemillasService>(SemillasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
