import { IsString, IsArray } from 'class-validator';

export class MealRecommendationDto {
  @IsString()
  userId: string;

  @IsArray()
  dietaryRestrictions: string[];

 
}