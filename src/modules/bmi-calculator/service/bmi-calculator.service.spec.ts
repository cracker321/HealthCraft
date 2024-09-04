import { Test, TestingModule } from '@nestjs/testing';
import { BmiCalculatorService } from './bmi-calculator.service';

describe('BmiCalculatorService', () => {
  let service: BmiCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BmiCalculatorService],
    }).compile();

    service = module.get<BmiCalculatorService>(BmiCalculatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
