// src/modules/vegan-diet/service/vegan-diet.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from '../../nutrition/entity/recipe.entity';
import { FoodDatabase } from '../../nutrition/entity/food-database.entity';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class VeganDietService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    @InjectRepository(FoodDatabase)
    private foodDatabaseRepository: Repository<FoodDatabase>,
    private userService: UserService
  ) {}

  // 비건/채식 레시피 추천 메서드
  async getVeganRecipes(userId: string, dietType: 'vegan' | 'vegetarian'): Promise<Recipe[]> {
    // 사용자의 영양 목표를 조회합니다.
    const user = await this.userService.findOne(userId);
    const nutritionGoal = await this.userService.getUserNutritionGoal(userId);

    // 비건/채식 레시피를 조회하는 쿼리를 생성합니다.
    const query = this.recipeRepository.createQueryBuilder('recipe')
      .where('recipe.dietType = :dietType', { dietType })
      .andWhere('recipe.calories <= :maxCalories', { maxCalories: nutritionGoal.dailyCalorieTarget / 3 })
      .andWhere('recipe.protein >= :minProtein', { minProtein: nutritionGoal.proteinTarget / 3 });

    // 사용자의 알레르기 정보를 고려하여 쿼리를 추가합니다.
    if (user.allergies && user.allergies.length > 0) {
      query.andWhere('recipe.allergens NOT IN (:...allergies)', { allergies: user.allergies });
    }

    // 조건에 맞는 레시피를 10개 반환합니다.
    return query.take(10).getMany();
  }

  // 비건/채식 식품 목록 조회 메서드
  async getVeganFoodList(dietType: 'vegan' | 'vegetarian'): Promise<FoodDatabase[]> {
    return this.foodDatabaseRepository.find({
      where: { dietType },
      take: 50  // 상위 50개 항목만 반환
    });
  }

  // 비건/채식 영양 가이드 제공 메서드
  async getVeganNutritionGuide(dietType: 'vegan' | 'vegetarian'): Promise<string[]> {
    const guide = [
      `${dietType === 'vegan' ? '비건' : '채식'} 식단 시 주의해야 할 영양소:`,
      "단백질: 콩, 렌틸콩, 퀴노아 등의 식물성 단백질 섭취를 늘리세요.",
      "비타민 B12: 영양제나 강화 식품을 통해 보충하는 것이 좋습니다.",
      "철분: 시금치, 렌틸콩, 호박씨 등 철분이 풍부한 식품을 섭취하세요.",
      "오메가-3: 아마씨, 치아씨, 호두 등을 통해 섭취할 수 있습니다.",
      "칼슘: 강화된 식물성 우유, 두부, 브로콜리 등으로 보충하세요."
    ];

    if (dietType === 'vegetarian') {
      guide.push("달걀과 유제품을 통해 추가적인 단백질과 영양소를 섭취할 수 있습니다.");
    }

    return guide;
  }

  // 비건/채식 전환 팁 제공 메서드
  async getVeganTransitionTips(): Promise<string[]> {
    return [
      "점진적으로 전환하세요. 하루 한 끼부터 시작해 보세요.",
      "다양한 식물성 단백질 원을 탐험해보세요.",
      "식물성 우유와 요거트 등 대체품을 시도해보세요.",
      "비건/채식 레스토랑이나 메뉴를 찾아 경험해보세요.",
      "비건/채식 커뮤니티에 참여해 정보와 경험을 공유하세요.",
      "영양 균형에 주의를 기울이고, 필요시 전문가와 상담하세요."
    ];
  }
}