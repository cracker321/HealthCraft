// src/modules/nutrition/nutrition.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NutritionGoal } from '../entity/nutrition-goal.entity';
import { MealRecord } from '../entity/meal-record.entity';
import { FoodDatabase } from '../entity/food-database.entity';
import { Recipe } from '../entity/recipe.entity';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class NutritionService {
  constructor(
    @InjectRepository(NutritionGoal)
    private nutritionGoalRepository: Repository<NutritionGoal>,
    @InjectRepository(MealRecord)
    private mealRecordRepository: Repository<MealRecord>,
    @InjectRepository(FoodDatabase)
    private foodDatabaseRepository: Repository<FoodDatabase>,
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    private userService: UserService
  ) {}

  // 영양 목표 생성 메서드
  async createNutritionGoal(userId: string, goalData: Partial<NutritionGoal>): Promise<NutritionGoal> {
    const user = await this.userService.findOne(userId);
    const goal = this.nutritionGoalRepository.create({ ...goalData, user });
    return this.nutritionGoalRepository.save(goal);
  }

  // 식사 기록 생성 메서드
  async recordMeal(userId: string, mealData: Partial<MealRecord>): Promise<MealRecord> {
    const user = await this.userService.findOne(userId);
    const meal = this.mealRecordRepository.create({ ...mealData, user });
    return this.mealRecordRepository.save(meal);
  }

  // 식이 제한에 맞는 레시피 조회 메서드
  async getRecipes(dietRestrictions: string[]): Promise<Recipe[]> {
    return this.recipeRepository.find({
      where: {
        dietaryRestrictions: {
          $nin: dietRestrictions
        }
      }
    });
  }

  // 선택된 음식의 총 칼로리 계산 메서드
  async calculateCalories(foodIds: string[]): Promise<number> {
    const foods = await this.foodDatabaseRepository.findByIds(foodIds);
    return foods.reduce((total, food) => total + food.caloriesPer100g, 0);
  }

  // 현재 영양 목표 조회 메서드
  async getCurrentNutritionGoal(userId: string): Promise<NutritionGoal> {
    const user = await this.userService.findOne(userId);
    return this.nutritionGoalRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' }
    });
  }

  // 식품 데이터베이스에서 음식 정보 조회 메서드
  async getFoodItem(foodId: string): Promise<FoodDatabase> {
    return this.foodDatabaseRepository.findOne({ where: { id: foodId } });
  }
}