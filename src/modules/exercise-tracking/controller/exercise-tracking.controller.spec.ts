import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseTrackingController } from './exercise-tracking.controller';

describe('ExerciseTrackingController', () => {
  let controller: ExerciseTrackingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExerciseTrackingController],
    }).compile();

    controller = module.get<ExerciseTrackingController>(ExerciseTrackingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
