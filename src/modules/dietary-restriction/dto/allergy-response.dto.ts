// src/modules/dietary-restriction/dto/allergy-response.dto.ts
import { Exclude, Expose } from 'class-transformer';

export class AllergyResponseDto {
  @Expose()
  id: string;

  @Expose()
  allergen: string;

  @Expose()
  severity: string;

  @Expose()
  diagnosisDate: Date;

  @Expose()
  symptoms: string[];

  @Expose()
  treatmentPlan?: string;

  @Expose()
  emergencyMedications?: string[];

  @Expose()
  isActive: boolean;

  @Exclude()
  userId: string;
}