// src/modules/dietary-restriction/dto/create-dietary-restriction.dto.ts

import { IsString, IsEnum, IsDate, IsOptional } from 'class-validator';

export class CreateDietaryRestrictionDto {
  @IsString()
  userId: string;

  @IsEnum(['vegetarian', 'vegan', 'gluten-free', 'lactose-free', 'nut-free', 'low-carb', 'low-fat', 'low-sodium', 'other'],
    { message: '유효한 제한 유형을 선택해주세요.' })
  restrictionType: string;

  @IsString()
  reason: string;

  @IsDate()
  startDate: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;
}