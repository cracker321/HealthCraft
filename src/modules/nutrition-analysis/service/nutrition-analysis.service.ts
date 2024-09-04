// src/modules/nutrition-analysis/service/nutrition-analysis.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { MealRecord } from '../../nutrition/entity/meal-record.entity';
import { NutritionGoal } from '../../nutrition/entity/nutrition-goal.entity';
import { UserService } from '../../user/service/user.service';

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
  async analyzeNutritionIntake(userId: string, startDate: Date, endDate: Date): Promise<any> {
    const mealRecords = await this.mealRecordRepository.find({
      where: {
        user: { id: userId },
        eatenAt: Between(startDate, endDate)
      }
    });

    const nutritionIntake = this.calculateNutritionIntake(mealRecords);
    const nutritionGoal = await this.nutritionGoalRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' }
    });

    return this.compareIntakeWithGoal(nutritionIntake, nutritionGoal);
  }

  private calculateNutritionIntake(mealRecords: MealRecord[]): any {
    // 영양소 섭취량 계산 로직
    // ...
  }

  private compareIntakeWithGoal(intake: any, goal: NutritionGoal): any {
    // 섭취량과 목표치 비교 로직
    // ...
  }
}