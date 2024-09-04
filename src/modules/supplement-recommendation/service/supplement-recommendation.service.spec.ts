import { Test, TestingModule } from '@nestjs/testing';
import { SupplementRecommendationService } from './supplement-recommendation.service';

describe('SupplementRecommendationService', () => {
  let service: SupplementRecommendationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplementRecommendationService],
    }).compile();

    service = module.get<SupplementRecommendationService>(SupplementRecommendationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
