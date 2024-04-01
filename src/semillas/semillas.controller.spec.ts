import { Test, TestingModule } from '@nestjs/testing';
import { SemillasController } from './semillas.controller';
import { SemillasService } from './semillas.service';

describe('SemillasController', () => {
  let controller: SemillasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SemillasController],
      providers: [SemillasService],
    }).compile();

    controller = module.get<SemillasController>(SemillasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
