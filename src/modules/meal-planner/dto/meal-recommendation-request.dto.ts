// src/modules/meal-planner/dto/meal-recommendation-request.dto.ts

import { IsDate, IsEnum } from 'class-validator';

export class MealRecommendationRequestDto {
  @IsDate({ message: '유효한 날짜를 입력해주세요.' })
  date: Date;

  @IsEnum(['breakfast', 'lunch', 'dinner', 'snack'], { message: '유효한 식사 유형을 선택해주세요.' })
  mealType: string;
}