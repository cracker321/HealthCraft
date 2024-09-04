import { Test, TestingModule } from '@nestjs/testing';
import { GoalTrackingService } from './goal-tracking.service';

describe('GoalTrackingService', () => {
  let service: GoalTrackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoalTrackingService],
    }).compile();

    service = module.get<GoalTrackingService>(GoalTrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
