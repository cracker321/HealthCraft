// src/modules/nutrition/dto/create-meal-plan.dto.ts

import { IsDate, IsEnum, IsArray, IsUUID } from 'class-validator';

export class CreateMealPlanDto {
  @IsDate()
  date: Date;

  @IsEnum(['breakfast', 'lunch', 'dinner', 'snack'])
  mealType: string;

  @IsArray()
  @IsUUID("4", { each: true })
  foodItemIds: string[];
}