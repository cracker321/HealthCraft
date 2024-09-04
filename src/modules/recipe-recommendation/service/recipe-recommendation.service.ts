// src/modules/recipe-recommendation/service/recipe-recommendation.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from '../../nutrition/entity/recipe.entity';
import { UserService } from '../../user/service/user.service';
import { NutritionService } from '../../nutrition/service/nutrition.service';

@Injectable()
export class RecipeRecommendationService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    private userService: UserService,
    private nutritionService: NutritionService
  ) {}

  // 사용자 맞춤 레시피 추천 메서드
  async getPersonalizedRecipes(userId: string): Promise<Recipe[]> {
    const user = await this.userService.findOne(userId);
    const nutritionGoal = await this.nutritionService.getCurrentNutritionGoal(userId);
    const dietaryRestrictions = await this.userService.getUserDietaryRestrictions(userId);

    const query = this.recipeRepository.createQueryBuilder('recipe')
      .where('recipe.calories <= :maxCalories', { maxCalories: nutritionGoal.dailyCalorieTarget / 3 })
      .andWhere('recipe.protein >= :minProtein', { minProtein: nutritionGoal.proteinTarget / 3 });

    dietaryRestrictions.forEach(restriction => {
      query.andWhere(`recipe.dietaryRestrictions NOT LIKE :restriction`, { restriction: `%${restriction}%` });
    });

    return query.take(10).getMany();
  }

  // 인기 레시피 추천 메서드
  async getPopularRecipes(): Promise<Recipe[]> {
    return this.recipeRepository.find({
      order: { rating: 'DESC' },
      take: 10
    });
  }

  // 계절별 레시피 추천 메서드
  async getSeasonalRecipes(): Promise<Recipe[]> {
    const currentMonth = new Date().getMonth() + 1;
    let season: string;

    if (currentMonth >= 3 && currentMonth <= 5) season = 'spring';
    else if (currentMonth >= 6 && currentMonth <= 8) season = 'summer';
    else if (currentMonth >= 9 && currentMonth <= 11) season = 'autumn';
    else season = 'winter';

    return this.recipeRepository.find({
      where: { season },
      take: 10
    });
  }
}