import { Test, TestingModule } from '@nestjs/testing';
import { AllergyManagementService } from './allergy-management.service';

describe('AllergyManagementService', () => {
  let service: AllergyManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllergyManagementService],
    }).compile();

    service = module.get<AllergyManagementService>(AllergyManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
