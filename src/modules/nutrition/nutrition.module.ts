// src/modules/nutrition/nutrition.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NutritionAnalysisService } from '../nutrition-analysis/service/nutrition-analysis.service';
import { DietRecommendationService } from '../../diet-recommendation/service/diet-recommendation.service';
import { NutritionController } from './controller/nutrition.controller';
import { MealRecord } from './entity/meal-record.entity';
import { NutritionGoal } from './entity/nutrition-goal.entity';
import { Recipe } from './entity/recipe.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MealRecord, NutritionGoal, Recipe]),
    UserModule,
  ],
  providers: [NutritionAnalysisService, DietRecommendationService],
  controllers: [NutritionController],
  exports: [NutritionAnalysisService, DietRecommendationService],
})
export class NutritionModule {}