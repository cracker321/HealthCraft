// src/modules/nutrition/dto/create-nutrition-goal.dto.ts

import { IsNumber, IsEnum, Min, Max } from 'class-validator';

export class CreateNutritionGoalDto {
  @IsEnum(['weight_loss', 'muscle_gain', 'maintenance', 'health_improvement'], 
    { message: '유효한 목표 유형을 선택해주세요.' })
  goalType: string;

  @IsNumber({}, { message: '일일 목표 칼로리는 숫자여야 합니다.' })
  @Min(1000, { message: '일일 목표 칼로리는 최소 1000kcal 이상이어야 합니다.' })
  @Max(5000, { message: '일일 목표 칼로리는 최대 5000kcal 이하여야 합니다.' })
  dailyCalorieTarget: number;

  @IsNumber({}, { message: '단백질 목표는 숫자여야 합니다.' })
  @Min(0, { message: '단백질 목표는 0g 이상이어야 합니다.' })
  proteinTarget: number;

  @IsNumber({}, { message: '탄수화물 목표는 숫자여야 합니다.' })
  @Min(0, { message: '탄수화물 목표는 0g 이상이어야 합니다.' })
  carbTarget: number;

  @IsNumber({}, { message: '지방 목표는 숫자여야 합니다.' })
  @Min(0, { message: '지방 목표는 0g 이상이어야 합니다.' })
  fatTarget: number;
}