import { Test, TestingModule } from '@nestjs/testing';
import { VeganDietService } from './vegan-diet.service';

describe('VeganDietService', () => {
  let service: VeganDietService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VeganDietService],
    }).compile();

    service = module.get<VeganDietService>(VeganDietService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
