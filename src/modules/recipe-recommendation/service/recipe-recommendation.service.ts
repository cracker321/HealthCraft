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
    // 사용자 정보, 영양 목표, 식이 제한 사항을 조회합니다.
    const user = await this.userService.findOne(userId);
    const nutritionGoal = await this.nutritionService.getCurrentNutritionGoal(userId);
    const dietaryRestrictions = await this.userService.getUserDietaryRestrictions(userId);

    // 사용자의 영양 목표와 식이 제한을 고려한 레시피 쿼리를 생성합니다.
    const query = this.recipeRepository.createQueryBuilder('recipe')
      .where('recipe.calories <= :maxCalories', { maxCalories: nutritionGoal.dailyCalorieTarget / 3 })
      .andWhere('recipe.protein >= :minProtein', { minProtein: nutritionGoal.proteinTarget / 3 });

    // 식이 제한 사항을 쿼리에 적용합니다.
    dietaryRestrictions.forEach(restriction => {
      query.andWhere(`recipe.dietaryRestrictions NOT LIKE :restriction`, { restriction: `%${restriction}%` });
    });

    // 조건에 맞는 상위 10개 레시피를 반환합니다.
    return query.take(10).getMany();
  }

  // 인기 레시피 추천 메서드
  async getPopularRecipes(): Promise<Recipe[]> {
    // 평점이 높은 순으로 상위 10개 레시피를 조회하여 반환합니다.
    return this.recipeRepository.find({
      order: { rating: 'DESC' },
      take: 10
    });
  }

  // 계절별 레시피 추천 메서드
  async getSeasonalRecipes(): Promise<Recipe[]> {
    // 현재 월을 기준으로 계절을 결정합니다.
    const currentMonth = new Date().getMonth() + 1;
    let season: string;

    if (currentMonth >= 3 && currentMonth <= 5) season = 'spring';
    else if (currentMonth >= 6 && currentMonth <= 8) season = 'summer';
    else if (currentMonth >= 9 && currentMonth <= 11) season = 'autumn';
    else season = 'winter';

    // 현재 계절에 맞는 레시피를 10개 조회하여 반환합니다.
    return this.recipeRepository.find({
      where: { season },
      take: 10
    });
  }
}