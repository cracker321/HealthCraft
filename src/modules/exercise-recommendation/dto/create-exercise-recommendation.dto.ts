// src/modules/exercise-recommendation/dto/create-exercise-recommendation.dto.ts
import { IsString, IsArray, IsNumber } from 'class-validator';

export class CreateExerciseRecommendationDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  intensityLevel: string;

  @IsArray()
  @IsString({ each: true })
  targetMuscleGroups: string[];

  @IsNumber()
  caloriesBurnedPerHour: number;

  @IsArray()
  @IsString({ each: true })
  equipmentNeeded: string[];

  @IsArray()
  @IsString({ each: true })
  suitableFor: string[];
}
