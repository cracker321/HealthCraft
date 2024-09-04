import { Test, TestingModule } from '@nestjs/testing';
import { NutritionAnalysisService } from './nutrition-analysis.service';

describe('NutritionAnalysisService', () => {
  let service: NutritionAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NutritionAnalysisService],
    }).compile();

    service = module.get<NutritionAnalysisService>(NutritionAnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
