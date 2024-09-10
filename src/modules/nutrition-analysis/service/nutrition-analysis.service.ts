// src/modules/nutrition-analysis/service/nutrition-analysis.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { MealRecord } from '../../nutrition/entity/meal-record.entity';
import { NutritionGoal } from '../../nutrition/entity/nutrition-goal.entity';
import { UserService } from '../../user/service/user.service';

interface NutritionIntake {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  [key: string]: number; // 기타 영양소를 위한 인덱스 시그니처
}

interface NutritionAnalysis {
  intake: NutritionIntake;
  goal: NutritionIntake;
  comparison: {
    [key: string]: {
      difference: number;
      percentageAchieved: number;
    };
  };
}

@Injectable()
export class NutritionAnalysisService {
  constructor(
    @InjectRepository(MealRecord)
    private mealRecordRepository: Repository<MealRecord>,
    @InjectRepository(NutritionGoal)
    private nutritionGoalRepository: Repository<NutritionGoal>,
    private userService: UserService
  ) {}

  // 사용자의 영양 섭취 분석을 수행하는 메서드
  async analyzeNutritionIntake(userId: string, startDate: Date, endDate: Date): Promise<NutritionAnalysis> {
    const mealRecords = await this.mealRecordRepository.find({
      where: {
        user: { id: userId },
        eatenAt: Between(startDate, endDate)
      },
      relations: ['foodItems', 'recipes'] // 관련된 음식 항목과 레시피를 함께 가져옵니다.
    });

    const nutritionIntake = this.calculateNutritionIntake(mealRecords);
    const nutritionGoal = await this.nutritionGoalRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' }
    });

    if (!nutritionGoal) {
      throw new Error('영양 목표를 찾을 수 없습니다.');
    }

    return this.compareIntakeWithGoal(nutritionIntake, nutritionGoal);
  }


  
  private calculateNutritionIntake(mealRecords: MealRecord[]): NutritionIntake {
    const totalIntake: NutritionIntake = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    };

    mealRecords.forEach(record => {
      // 음식 항목의 영양소 계산
      record.foodItems.forEach(foodItem => {
        const portion = record.portions[foodItem.id] || 1; // 기본값 1로 설정
        totalIntake.calories += foodItem.caloriesPer100g * portion / 100;
        totalIntake.protein += foodItem.proteinPer100g * portion / 100;
        totalIntake.carbs += foodItem.carbsPer100g * portion / 100;
        totalIntake.fat += foodItem.fatPer100g * portion / 100;
      });

      // 레시피의 영양소 계산
      record.recipes.forEach(recipe => {
        const servings = record.recipeServings[recipe.id] || 1; // 기본값 1로 설정
        totalIntake.calories += recipe.calories * servings;
        totalIntake.protein += recipe.protein * servings;
        totalIntake.carbs += recipe.carbs * servings;
        totalIntake.fat += recipe.fat * servings;
      });
    });


    return totalIntake;
  }

  private compareIntakeWithGoal(intake: NutritionIntake, goal: NutritionGoal): NutritionAnalysis {
    const comparison: NutritionAnalysis['comparison'] = {};

    Object.keys(intake).forEach(nutrient => {
      const goalValue = goal[nutrient as keyof NutritionGoal] as number;
      const intakeValue = intake[nutrient];
      comparison[nutrient] = {
        difference: Number((intakeValue - goalValue).toFixed(2)),
        percentageAchieved: Number(((intakeValue / goalValue) * 100).toFixed(2))
      };
    });

    return {
      intake,
      goal: {
        calories: goal.dailyCalorieTarget,
        protein: goal.proteinTarget,
        carbs: goal.carbTarget,
        fat: goal.fatTarget
      },
      comparison
    };
  }

}