import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NutritionAnalysisService } from '../nutrition-analysis/service/nutrition-analysis.service';
import { DietRecommendationService } from '../diet-recommendation/service/diet-recommendation.service';
import { NutritionController } from './controller/nutrition.controller';
import { MealRecord } from './entity/meal-record.entity';
import { NutritionGoal } from './entity/nutrition-goal.entity';
import { Recipe } from './entity/recipe.entity';
import { FoodDatabase } from './entity/food-database.entity';  // FoodDatabase 엔티티 추가
import { UserModule } from '../user/user.module';
import { NutritionService } from './service/nutrition.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MealRecord, NutritionGoal, Recipe, FoodDatabase]),  // FoodDatabase를 forFeature에 추가
    UserModule,
  ],
  providers: [
    NutritionAnalysisService, 
    DietRecommendationService, 
    NutritionService  // NutritionService를 providers에 추가
  ],
  controllers: [NutritionController],
  exports: [
    NutritionAnalysisService, 
    DietRecommendationService,
    NutritionService  // NutritionService를 exports에 추가하여 다른 모듈에서 사용할 수 있도록 함
  ],
})
export class NutritionModule {}
