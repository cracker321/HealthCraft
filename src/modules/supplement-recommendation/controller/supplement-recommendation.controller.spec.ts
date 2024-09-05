import { Test, TestingModule } from '@nestjs/testing';
import { SupplementRecommendationController } from './supplement-recommendation.controller';

describe('SupplementRecommendationController', () => {
  let controller: SupplementRecommendationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplementRecommendationController],
    }).compile();

    controller = module.get<SupplementRecommendationController>(SupplementRecommendationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
