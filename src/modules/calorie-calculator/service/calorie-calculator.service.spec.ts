import { Test, TestingModule } from '@nestjs/testing';
import { CalorieCalculatorService } from './calorie-calculator.service';

describe('CalorieCalculatorService', () => {
  let service: CalorieCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalorieCalculatorService],
    }).compile();

    service = module.get<CalorieCalculatorService>(CalorieCalculatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
