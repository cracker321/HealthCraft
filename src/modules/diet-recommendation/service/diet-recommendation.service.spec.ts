import { Test, TestingModule } from '@nestjs/testing';
import { DietRecommendationService } from './diet-recommendation.service';

describe('DietRecommendationService', () => {
  let service: DietRecommendationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DietRecommendationService],
    }).compile();

    service = module.get<DietRecommendationService>(DietRecommendationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
