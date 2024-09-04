import { Test, TestingModule } from '@nestjs/testing';
import { RecipeRecommendationService } from './recipe-recommendation.service';

describe('RecipeRecommendationService', () => {
  let service: RecipeRecommendationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipeRecommendationService],
    }).compile();

    service = module.get<RecipeRecommendationService>(RecipeRecommendationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
