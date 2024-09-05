// src/modules/meal-planner/dto/update-meal-plan.dto.ts

import { IsString, IsArray, IsOptional } from 'class-validator';

export class UpdateMealPlanDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsArray()
  meals?: {
    date: Date;
    type: string; // breakfast, lunch, dinner, snack
    recipeId: string;
  }[];
}