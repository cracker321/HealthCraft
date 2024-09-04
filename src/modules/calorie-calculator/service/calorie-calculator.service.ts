// src/modules/calorie-calculator/service/calorie-calculator.service.ts
import { Injectable } from '@nestjs/common';
import { NutritionService } from '../../nutrition/service/nutrition.service';
import { FoodDatabaseService } from '../../food-database/service/food-database.service';

@Injectable()
export class CalorieCalculatorService {
  constructor(
    private nutritionService: NutritionService,
    private foodDatabaseService: FoodDatabaseService,
  ) {}

  // 선택한 음식의 총 칼로리를 계산하는 메서드
  async calculateTotalCalories(foodIds: string[], portions: { [foodId: string]: number }): Promise<number> {
    let totalCalories = 0;
    for (const foodId of foodIds) {
      // 각 음식 항목에 대한 정보를 조회합니다.
      const food = await this.foodDatabaseService.getFoodItem(foodId);
      // 해당 음식의 섭취량을 가져옵니다. 기본값은 1(100g)으로 설정합니다.
      const portion = portions[foodId] || 1;
      // 음식의 칼로리를 계산하여 총 칼로리에 더합니다.
      totalCalories += food.caloriesPer100g * (portion / 100);
    }
    return totalCalories;
  }

  // 사용자의 일일 권장 칼로리를 계산하는 메서드
  async calculateDailyCalorieNeeds(userId: string): Promise<number> {
    // 사용자의 현재 영양 목표를 조회합니다.
    const nutritionGoal = await this.nutritionService.getCurrentNutritionGoal(userId);
    // 영양 목표에 설정된 일일 칼로리 목표를 반환합니다.
    return nutritionGoal.dailyCalorieTarget;
  }

  // 음식의 영양 정보를 계산하는 메서드
  async calculateNutritionInfo(foodId: string, portion: number): Promise<any> {
    // 지정된 음식 항목의 정보를 조회합니다.
    const food = await this.foodDatabaseService.getFoodItem(foodId);
    // 섭취량에 따른 비율을 계산합니다.
    const factor = portion / 100;
    // 섭취량에 따른 영양 정보를 계산하여 반환합니다.
    return {
      calories: food.caloriesPer100g * factor,
      protein: food.proteinPer100g * factor,
      carbs: food.carbsPer100g * factor,
      fat: food.fatPer100g * factor,
    };
  }
}