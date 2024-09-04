// src/modules/meal-planner/service/meal-planner.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealPlan } from '../entity/meal-plan.entity';
import { NutritionService } from '../../nutrition/service/nutrition.service';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class MealPlannerService {
  constructor(
    @InjectRepository(MealPlan)
    private mealPlanRepository: Repository<MealPlan>,
    private nutritionService: NutritionService,
    private userService: UserService,
  ) {}

  // 주간 식단 계획을 생성하는 메서드
  async createWeeklyPlan(userId: string): Promise<MealPlan> {
    // 사용자 정보와 영양 목표를 조회합니다.
    const user = await this.userService.findOne(userId);
    const nutritionGoal = await this.nutritionService.getCurrentNutritionGoal(userId);
    
    // 사용자의 영양 목표와 식이 제한을 고려하여 식단을 생성합니다.
    const meals = await this.generateMeals(nutritionGoal, user.dietaryRestrictions);
    
    // MealPlan 엔티티 인스턴스를 생성합니다.
    const mealPlan = this.mealPlanRepository.create({
      user: { id: userId },
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후
      meals: meals,
    });

    // 생성된 식단 계획을 데이터베이스에 저장하고 반환합니다.
    return this.mealPlanRepository.save(mealPlan);
  }

  // 식단 계획을 생성하는 내부 메서드
  private async generateMeals(nutritionGoal: any, dietaryRestrictions: string[]): Promise<any[]> {
    // TODO: 실제 식단 생성 로직을 구현해야 합니다.
    // 이 부분에서는 nutritionGoal과 dietaryRestrictions를 고려하여
    // 적절한 레시피와 음식을 선택하여 7일치 식단을 생성해야 합니다.
    return [];
  }

  // 식단 계획을 조회하는 메서드
  async getMealPlan(userId: string): Promise<MealPlan> {
    // 사용자의 가장 최근 식단 계획을 조회합니다.
    return this.mealPlanRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  // 식단 계획을 업데이트하는 메서드
  async updateMealPlan(planId: string, updatedMeals: any[]): Promise<MealPlan> {
    // 지정된 ID의 식단 계획을 조회합니다.
    const plan = await this.mealPlanRepository.findOne({ where: { id: planId } });
    // 식단 계획의 meals 필드를 업데이트합니다.
    plan.meals = updatedMeals;
    // 업데이트된 식단 계획을 저장하고 반환합니다.
    return this.mealPlanRepository.save(plan);
  }
}