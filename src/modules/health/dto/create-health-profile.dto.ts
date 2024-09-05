// src/modules/health/dto/create-health-profile.dto.ts

import { IsNumber, IsString, IsEnum, Min, Max } from 'class-validator';

export class CreateHealthProfileDto {
  @IsNumber()
  @Min(0, { message: '키는 0보다 커야 합니다.' })
  @Max(300, { message: '키는 300cm를 초과할 수 없습니다.' })
  height: number;

  @IsNumber()
  @Min(0, { message: '체중은 0보다 커야 합니다.' })
  @Max(500, { message: '체중은 500kg을 초과할 수 없습니다.' })
  weight: number;

  @IsEnum(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'], 
    { message: '유효한 활동 수준을 선택해주세요.' })
  activityLevel: string;

  @IsEnum(['weight_loss', 'muscle_gain', 'maintenance', 'general_health'], 
    { message: '유효한 건강 목표를 선택해주세요.' })
  healthGoal: string;
}