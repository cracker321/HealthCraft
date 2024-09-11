import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from '../../nutrition/entity/recipe.entity';
import { UserService } from '../../user/service/user.service';
import { NutritionAnalysisService } from '../../nutrition-analysis/service/nutrition-analysis.service';
import { DietaryRestriction } from '../../dietary-restriction/entity/dietary-restriction.entity';

@Injectable()
export class DietRecommendationService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    private userService: UserService,
    private nutritionAnalysisService: NutritionAnalysisService
  ) {}

  // 개인화된 식단 추천 메서드
  async recommendPersonalizedDiet(userId: string): Promise<Recipe[]> {
    const user = await this.userService.findOne(userId);
    const nutritionAnalysis = await this.nutritionAnalysisService.analyzeNutritionIntake(
      userId,
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      new Date()
    );

    return this.findSuitableRecipes(nutritionAnalysis, user.dietaryRestrictions);
  }

  // 적합한 레시피 찾기 메서드
  private async findSuitableRecipes(nutritionAnalysis: any, dietaryRestrictions: DietaryRestriction[]): Promise<Recipe[]> {
    const restrictionTypes = dietaryRestrictions.map(restriction => restriction.type);
    return this.recipeRepository.createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.dietaryRestrictions', 'dietaryRestriction')
      .where('dietaryRestriction.type NOT IN (:...restrictionTypes)', { restrictionTypes })
      .andWhere('recipe.calories <= :maxCalories', { maxCalories: nutritionAnalysis.goal.calories * 1.1 })
      .andWhere('recipe.protein >= :minProtein', { minProtein: nutritionAnalysis.goal.protein * 0.9 })
      .getMany();
  }
}