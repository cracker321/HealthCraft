import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseRecommendationService } from './exercise-recommendation.service';

describe('ExerciseRecommendationService', () => {
  let service: ExerciseRecommendationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExerciseRecommendationService],
    }).compile();

    service = module.get<ExerciseRecommendationService>(ExerciseRecommendationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
