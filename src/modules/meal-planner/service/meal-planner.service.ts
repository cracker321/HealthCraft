// src/modules/meal-planner/meal-planner.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealPlan } from '../entity/meal-plan.entity';
import { NutritionService } from '../../nutrition/service/nutrition.service';
import { UserService } from '../../user/service/user.service';
import { RecipeRecommendationService } from '../../recipe-recommendation/service/recipe-recommendation.service';
import { Recipe } from '../../nutrition/entity/recipe.entity';
import { NutritionGoal } from '../../nutrition/entity/nutrition-goal.entity';

@Injectable()
export class MealPlannerService {
  constructor(
    @InjectRepository(MealPlan)
    private mealPlanRepository: Repository<MealPlan>,
    private nutritionService: NutritionService,
    private userService: UserService,
    private recipeRecommendationService: RecipeRecommendationService
  ) {}

  // 주간 식단 계획 생성 메서드
  async createWeeklyPlan(userId: string): Promise<MealPlan> {
    const user = await this.userService.findOne(userId);
    const nutritionGoal = await this.nutritionService.getCurrentNutritionGoal(userId);
    const dietaryRestrictions = await this.userService.getUserDietaryRestrictions(userId);
    
    const recipes = await this.recipeRecommendationService.getPersonalizedRecipes(userId);
    const meals = this.generateMeals(recipes, nutritionGoal, dietaryRestrictions);
    
    // 식단 계획 생성 및 저장
    const mealPlan = this.mealPlanRepository.create({
      user,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후
      meals: meals,
    });
    return this.mealPlanRepository.save(mealPlan);


  }
  // 식단 계획 조회 메서드
  async getMealPlan(userId: string): Promise<MealPlan> {
    return this.mealPlanRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  // 식단 계획 업데이트 메서드
  async updateMealPlan(planId: string, updatedMeals: any[]): Promise<MealPlan> {
    const plan = await this.mealPlanRepository.findOne({ where: { id: planId } });
    plan.meals = updatedMeals;
    return this.mealPlanRepository.save(plan);
  }

  // 식단 생성 로직
  private generateMeals(recipes: Recipe[], nutritionGoal: NutritionGoal, dietaryRestrictions: string[]): any[] {
    const meals = [];
    const daysInWeek = 7;
    const mealsPerDay = 3; // 아침, 점심, 저녁
    for (let day = 0; day < daysInWeek; day++) {
      const dailyMeals = [];
      for (let meal = 0; meal < mealsPerDay; meal++) {
        // 적합한 레시피 필터링
        const suitableRecipes = this.filterRecipes(recipes, nutritionGoal, dietaryRestrictions);
        // 랜덤으로 레시피 선택
        const selectedRecipe = this.selectRandomRecipe(suitableRecipes);
        dailyMeals.push(selectedRecipe);
      }
      meals.push(dailyMeals);
    }
    return meals;
  }

  // 레시피 필터링 메서드
  private filterRecipes(recipes: Recipe[], nutritionGoal: NutritionGoal, dietaryRestrictions: string[]): Recipe[] {
    return recipes.filter(recipe => {
      // 식이 제한 사항 체크
      const meetsRestrictions = dietaryRestrictions.every(restriction => 
        !recipe.dietaryRestrictions.includes(restriction)
      );
      // 영양 목표 체크
      const meetsNutritionGoal = 
        recipe.calories <= (nutritionGoal.dailyCalorieTarget / 3) &&
        recipe.protein >= (nutritionGoal.proteinTarget / 3) &&
        recipe.carbs <= (nutritionGoal.carbTarget / 3) &&
        recipe.fat <= (nutritionGoal.fatTarget / 3);
      return meetsRestrictions && meetsNutritionGoal;
    });
  }

  // 랜덤 레시피 선택 메서드
  private selectRandomRecipe(recipes: Recipe[]): Recipe {
    const randomIndex = Math.floor(Math.random() * recipes.length);
    return recipes[randomIndex];
  }
}
