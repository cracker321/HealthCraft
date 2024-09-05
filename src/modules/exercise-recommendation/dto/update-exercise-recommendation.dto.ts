// src/modules/exercise-recommendation/dto/update-exercise-recommendation.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateExerciseRecommendationDto } from './create-exercise-recommendation.dto';

export class UpdateExerciseRecommendationDto extends PartialType(CreateExerciseRecommendationDto) {}