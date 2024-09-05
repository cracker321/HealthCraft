// src/modules/nutrition/dto/meal-recommendation.dto.ts

import { IsString, IsArray } from 'class-validator';

export class MealRecommendationDto {
  @IsString()
  userId: string;

  @IsArray()
  dietaryRestrictions: string[];

  @IsString()
  mealType: string; // breakfast, lunch, dinner, snack
}