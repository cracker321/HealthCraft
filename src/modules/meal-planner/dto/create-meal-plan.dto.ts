// src/modules/meal-planner/dto/create-meal-plan.dto.ts

import { IsString, IsArray, IsDate } from 'class-validator';

export class CreateMealPlanDto {
  @IsString()
  userId: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsArray()
  meals: {
    date: Date;
    type: string; // breakfast, lunch, dinner, snack
    recipeId: string;
  }[];
}
