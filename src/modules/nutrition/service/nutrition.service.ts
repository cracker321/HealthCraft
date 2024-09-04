// src/modules/nutrition/service/nutrition.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NutritionGoal } from '../entity/nutrition-goal.entity';
import { MealRecord } from '../entity/meal-record.entity';
import { FoodDatabase } from '../entity/food-database.entity';
import { Recipe } from '../entity/recipe.entity';

@Injectable()
export class NutritionService {
  constructor(
    // 각 영양 관련 엔티티에 대한 TypeORM 리포지토리를 주입받습니다.
    @InjectRepository(NutritionGoal)
    private nutritionGoalRepository: Repository<NutritionGoal>,
    @InjectRepository(MealRecord)
    private mealRecordRepository: Repository<MealRecord>,
    @InjectRepository(FoodDatabase)
    private foodDatabaseRepository: Repository<FoodDatabase>,
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
  ) {}

  // 영양 목표를 생성하는 메서드
  async createNutritionGoal(userId: string, goalData: Partial<NutritionGoal>): Promise<NutritionGoal> {
    // NutritionGoal 엔티티 인스턴스를 생성하고 사용자 ID를 연결합니다.
    const goal = this.nutritionGoalRepository.create({ ...goalData, user: { id: userId } });
    // 생성된 목표를 데이터베이스에 저장하고 반환합니다.
    return this.nutritionGoalRepository.save(goal);
  }

  // 식사 기록을 저장하는 메서드
  async recordMeal(userId: string, mealData: Partial<MealRecord>): Promise<MealRecord> {
    // MealRecord 엔티티 인스턴스를 생성하고 사용자 ID를 연결합니다.
    const meal = this.mealRecordRepository.create({ ...mealData, user: { id: userId } });
    // 생성된 식사 기록을 데이터베이스에 저장하고 반환합니다.
    return this.mealRecordRepository.save(meal);
  }

  // 식이 제한에 맞는 레시피를 조회하는 메서드
  async getRecipes(dietRestrictions: string[]): Promise<Recipe[]> {
    // TODO: 식이 제한에 맞는 레시피를 조회하는 로직을 구현해야 합니다.
    // 예: dietRestrictions 배열을 사용하여 적절한 WHERE 조건을 생성
    return this.recipeRepository.find({ where: { /* 조건 추가 */ } });
  }

  // 선택된 음식의 총 칼로리를 계산하는 메서드
  async calculateCalories(foodIds: string[]): Promise<number> {
    // 지정된 ID의 음식들을 데이터베이스에서 조회합니다.
    const foods = await this.foodDatabaseRepository.findByIds(foodIds);
    // 조회된 음식들의 칼로리 합계를 계산하여 반환합니다.
    return foods.reduce((total, food) => total + food.calories, 0);
  }
}