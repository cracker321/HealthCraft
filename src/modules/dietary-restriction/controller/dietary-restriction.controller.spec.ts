import { Test, TestingModule } from '@nestjs/testing';
import { DietaryRestrictionController } from './dietary-restriction.controller';

describe('DietaryRestrictionController', () => {
  let controller: DietaryRestrictionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DietaryRestrictionController],
    }).compile();

    controller = module.get<DietaryRestrictionController>(DietaryRestrictionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
