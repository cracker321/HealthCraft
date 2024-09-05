// src/modules/dietary-restriction/dto/create-allergy.dto.ts

import { IsString, IsEnum, IsDate, IsArray } from 'class-validator';

export class CreateAllergyDto {
  @IsString()
  userId: string;

  @IsString()
  allergen: string;

  @IsEnum(['mild', 'moderate', 'severe'], { message: '유효한 반응 정도를 선택해주세요.' })
  severity: string;

  @IsDate()
  diagnosisDate: Date;

  @IsArray()
  symptoms: string[];
}