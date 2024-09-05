// src/modules/dietary-restriction/dto/create-allergy.dto.ts
import { IsString, IsEnum, IsDate, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class CreateAllergyDto {
  @IsString()
  userId: string;

  @IsString()
  @IsNotEmpty({ message: '알레르기 유발 물질은 필수입니다.' })
  allergen: string;

  @IsEnum(['mild', 'moderate', 'severe'], { message: '유효한 반응 정도를 선택해주세요.' })
  severity: string;

  @IsDate()
  diagnosisDate: Date;

  @IsArray()
  @IsNotEmpty({ message: '증상은 최소 하나 이상 입력해야 합니다.' })
  symptoms: string[];

  @IsOptional()
  @IsString()
  treatmentPlan?: string;

  @IsOptional()
  @IsArray()
  emergencyMedications?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}