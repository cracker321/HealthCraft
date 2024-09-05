// src/modules/nutrition/service/nutrition.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NutritionGoal } from '../entity/nutrition-goal.entity';
import { MealRecord } from '../entity/meal-record.entity';
import { FoodDatabase } from '../entity/food-database.entity';
import { Recipe } from '../entity/recipe.entity';
import { UserService } from '../../user/service/user.service';
import { CreateMealPlanDto } from '../dto/create-meal-plan.dto';

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

  // 영양 분석 메서드
  async analyzeNutrition(userId: string): Promise<any> {
    const user = await this.userService.findOne(userId);
    const mealRecords = await this.mealRecordRepository.find({
      where: { user: { id: userId } },
      relations: ['foodItems']
    });
    
    const analysis = {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0
    };

    mealRecords.forEach(record => {
      record.foodItems.forEach(food => {
        analysis.totalCalories += food.caloriesPer100g;
        analysis.totalProtein += food.proteinPer100g;
        analysis.totalCarbs += food.carbsPer100g;
        analysis.totalFat += food.fatPer100g;
      });
    });

    return analysis;
  }

  // 식단 추천 메서드
  async recommendMeal(userId: string): Promise<Recipe[]> {
    const user = await this.userService.findOne(userId);
    const nutritionGoal = await this.nutritionGoalRepository.findOne({
      where: { user: { id: userId } }
    });

    // 사용자의 영양 목표에 맞는 레시피를 추천합니다.
    const recommendedRecipes = await this.recipeRepository.find({
      where: {
        calories: nutritionGoal.dailyCalorieTarget / 3, // 하루 3끼 기준
        protein: nutritionGoal.proteinTarget / 3,
        carbs: nutritionGoal.carbTarget / 3,
        fat: nutritionGoal.fatTarget / 3
      },
      take: 5 // 상위 5개 레시피만 추천
    });

    return recommendedRecipes;
  }

  async getCurrentNutritionGoal(userId: string): Promise<NutritionGoal> {
    const user = await this.userService.findOne(userId);
    return this.nutritionGoalRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' }
    });
  }

  // 칼로리 계산 메서드
  async calculateCalories(foodItems: string[]): Promise<number> {
    const foods = await this.foodDatabaseRepository.findByIds(foodItems);
    return foods.reduce((total, food) => total + food.caloriesPer100g, 0);
  }

  // 식단 플래너 메서드
  async createMealPlan(userId: string, mealPlanData: CreateMealPlanDto): Promise<MealRecord> {
    const user = await this.userService.findOne(userId);
    const mealPlan = new MealRecord();
    mealPlan.user = user;
    mealPlan.eatenAt = mealPlanData.date;
    mealPlan.mealType = mealPlanData.mealType;
    
    const foodItems = await this.foodDatabaseRepository.findByIds(mealPlanData.foodItemIds);
    mealPlan.foodItems = foodItems;

    return this.mealRecordRepository.save(mealPlan);
  }
}