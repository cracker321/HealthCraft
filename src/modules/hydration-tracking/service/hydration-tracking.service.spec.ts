import { Test, TestingModule } from '@nestjs/testing';
import { HydrationTrackingService } from './hydration-tracking.service';

describe('HydrationTrackingService', () => {
  let service: HydrationTrackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HydrationTrackingService],
    }).compile();

    service = module.get<HydrationTrackingService>(HydrationTrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
