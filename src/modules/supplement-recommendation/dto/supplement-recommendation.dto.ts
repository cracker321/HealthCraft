// src/modules/supplement/dto/supplement-recommendation.dto.ts

import { IsString, IsArray } from 'class-validator';

export class SupplementRecommendationDto {
  @IsString()
  userId: string;

  @IsArray()
  healthIssues: string[];

  @IsArray()
  dietaryRestrictions: string[];
}