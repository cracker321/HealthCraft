// src/modules/diet-recommendation/service/diet-recommendation.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from '../../nutrition/entity/recipe.entity';
import { UserService } from '../../user/service/user.service';
import { NutritionAnalysisService } from '../../nutrition-analysis/service/nutrition-analysis.service';

@Injectable()
export class DietRecommendationService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    private userService: UserService,
    private nutritionAnalysisService: NutritionAnalysisService
  ) {}

  // 개인화된 식단을 추천하는 메서드
  async recommendPersonalizedDiet(userId: string): Promise<Recipe[]> {
    const user = await this.userService.findOne(userId);
    const nutritionAnalysis = await this.nutritionAnalysisService.analyzeNutritionIntake(
      userId,
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 일주일 전
      new Date()
    );

    return this.findSuitableRecipes(nutritionAnalysis, user.dietaryRestrictions);
  }

  private async findSuitableRecipes(nutritionAnalysis: any, dietaryRestrictions: string[]): Promise<Recipe[]> {
    // 영양 분석 결과와 식이 제한을 고려한 레시피 검색 로직
    // ...
  }
}