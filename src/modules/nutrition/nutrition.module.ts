import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NutritionAnalysisService } from '../nutrition-analysis/service/nutrition-analysis.service';
import { DietRecommendationService } from '../diet-recommendation/service/diet-recommendation.service';
import { NutritionController } from './controller/nutrition.controller';
import { MealRecord } from './entity/meal-record.entity';
import { Recipe } from './entity/recipe.entity';
import { FoodDatabase } from './entity/food-database.entity';
import { NutritionGoal } from './entity/nutrition-goal.entity'; // NutritionGoal 엔티티 추가
import { UserModule } from '../user/user.module';
import { NutritionService } from './service/nutrition.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MealRecord, Recipe, FoodDatabase, NutritionGoal]), // NutritionGoal 추가
    UserModule,
  ],
  providers: [
    NutritionAnalysisService,
    DietRecommendationService,
    NutritionService
  ],
  controllers: [NutritionController],
  exports: [
    NutritionAnalysisService,
    DietRecommendationService,
    NutritionService
  ],
})
export class NutritionModule {}