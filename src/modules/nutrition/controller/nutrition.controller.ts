import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { NutritionService } from '../service/nutrition.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';

@Controller('nutrition')
@UseGuards(JwtAuthGuard)
export class NutritionController {
  constructor(private readonly nutritionService: NutritionService) {}

  // 영양 분석 엔드포인트
  @Get('analysis/:userId')
  async getNutritionAnalysis(@Param('userId') userId: string) {
    return this.nutritionService.analyzeNutrition(userId);
  }

  // 식단 추천 엔드포인트
  @Get('meal-recommendation/:userId')
  async getMealRecommendation(@Param('userId') userId: string) {
    return this.nutritionService.recommendMeal(userId);
  }

  // 칼로리 계산 엔드포인트
  @Post('calculate-calories')
  async calculateCalories(@Body() foodItems: any[]) {
    return this.nutritionService.calculateCalories(foodItems);
  }

  // 식단 플래너 엔드포인트
  @Post('meal-plan/:userId')
  async createMealPlan(@Param('userId') userId: string, @Body() mealPlanData: any) {
    return this.nutritionService.createMealPlan(userId, mealPlanData);
  }
}
