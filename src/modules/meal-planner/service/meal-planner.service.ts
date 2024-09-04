// src/modules/meal-planner/service/meal-planner.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealPlan } from '../entity/meal-plan.entity';
import { NutritionService } from '../../nutrition/service/nutrition.service';
import { UserService } from '../../user/service/user.service';
import { RecipeRecommendationService } from '../../recipe-recommendation/service/recipe-recommendation.service';

@Injectable()
export class MealPlannerService {
  constructor(
    @InjectRepository(MealPlan)
    private mealPlanRepository: Repository<MealPlan>,
    private nutritionService: NutritionService,
    private userService: UserService,
    private recipeRecommendationService: RecipeRecommendationService
  ) {}

  // 주간 식단 계획을 생성하는 메서드
  async createWeeklyPlan(userId: string): Promise<MealPlan> {
    const user = await this.userService.findOne(userId);
    const nutritionGoal = await this.nutritionService.getCurrentNutritionGoal(userId);
    const dietaryRestrictions = await this.userService.getUserDietaryRestrictions(userId);
    
    const recipes = await this.recipeRecommendationService.getPersonalizedRecipes(userId);
    const meals = this.generateMeals(recipes, nutritionGoal, dietaryRestrictions);
    
    const mealPlan = this.mealPlanRepository.create({
      user,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후
      meals: meals,
    });

    return this.mealPlanRepository.save(mealPlan);
  }

  // 식단 계획을 조회하는 메서드
  async getMealPlan(userId: string): Promise<MealPlan> {
    return this.mealPlanRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  // 식단 계획을 업데이트하는 메서드
  async updateMealPlan(planId: string, updatedMeals: any[]): Promise<MealPlan> {
    const plan = await this.mealPlanRepository.findOne({ where: { id: planId } });
    plan.meals = updatedMeals;
    return this.mealPlanRepository.save(plan);
  }

  // 식단 생성 로직을 구현하는 메서드
  private generateMeals(recipes: any[], nutritionGoal: any, dietaryRestrictions: string[]): any[] {
    const meals = [];
    const daysInWeek = 7;
    const mealsPerDay = 3; // 아침, 점심, 저녁

    for (let day = 0; day < daysInWeek; day++) {
      const dailyMeals = [];
      for (let meal = 0; meal < mealsPerDay; meal++) {
        const suitableRecipes = this.filterRecipes(recipes, nutritionGoal, dietaryRestrictions);
        const selectedRecipe = this.selectRandomRecipe(suitableRecipes);
        dailyMeals.push(selectedRecipe);
      }
      meals.push(dailyMeals);
    }

    return meals;
  }

  // 레시피를 필터링하는 메서드
  private filterRecipes(recipes: any[], nutritionGoal: any, dietaryRestrictions: string[]): any[] {
    return recipes.filter(recipe => {
      // 식이 제한 사항 체크
      const meetsRestrictions = dietaryRestrictions.every(restriction => 
        !recipe.dietaryRestrictions.includes(restriction)
      );

      // 영양 목표 체크 (간단한 예시, 실제로는 더 복잡할 수 있음)
      const meetsNutritionGoal = 
        recipe.calories <= (nutritionGoal.dailyCalorieTarget / 3) && // 하루 칼로리의 1/3 이하
        recipe.protein >= (nutritionGoal.proteinTarget / 3) &&       // 하루 단백질의 1/3 이상
        recipe.carbs <= (nutritionGoal.carbTarget / 3) &&            // 하루 탄수화물의 1/3 이하
        recipe.fat <= (nutritionGoal.fatTarget / 3);                 // 하루 지방의 1/3 이하

      return meetsRestrictions && meetsNutritionGoal;
    });
  }

  // 무작위로 레시피를 선택하는 메서드
  private selectRandomRecipe(recipes: any[]): any {
    const randomIndex = Math.floor(Math.random() * recipes.length);
    return recipes[randomIndex];
  }

  // 식단 계획의 영양 정보를 계산하는 메서드
  async calculateMealPlanNutrition(mealPlan: MealPlan): Promise<any> {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    mealPlan.meals.forEach(day => {
      day.forEach(meal => {
        totalCalories += meal.calories;
        totalProtein += meal.protein;
        totalCarbs += meal.carbs;
        totalFat += meal.fat;
      });
    });

    return {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      averageDailyCalories: totalCalories / 7,
      averageDailyProtein: totalProtein / 7,
      averageDailyCarbs: totalCarbs / 7,
      averageDailyFat: totalFat / 7,
    };
  }

  // 식단 계획의 다양성을 확인하는 메서드
  checkMealPlanDiversity(mealPlan: MealPlan): boolean {
    const uniqueRecipes = new Set();
    mealPlan.meals.forEach(day => {
      day.forEach(meal => {
        uniqueRecipes.add(meal.id);
      });
    });

    // 최소 14개의 서로 다른 레시피가 있어야 다양성이 있다고 판단
    return uniqueRecipes.size >= 14;
  }
}