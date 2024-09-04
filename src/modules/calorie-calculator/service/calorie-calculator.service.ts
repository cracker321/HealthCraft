// src/modules/calorie-calculator/service/calorie-calculator.service.ts
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class CalorieCalculatorService {
  constructor(private userService: UserService) {}

  // 기초 대사량(BMR)을 계산하는 메서드
  async calculateBMR(userId: string): Promise<number> {
    const user = await this.userService.findOne(userId);
    const latestHealthProfile = user.healthProfiles[user.healthProfiles.length - 1];

    let bmr;
    if (user.gender === 'male') {
      bmr = 88.362 + (13.397 * latestHealthProfile.weight) + (4.799 * latestHealthProfile.height) - (5.677 * user.age);
    } else {
      bmr = 447.593 + (9.247 * latestHealthProfile.weight) + (3.098 * latestHealthProfile.height) - (4.330 * user.age);
    }

    return Math.round(bmr);
  }

  // 일일 권장 칼로리를 계산하는 메서드
  async calculateDailyCalories(userId: string): Promise<number> {
    const bmr = await this.calculateBMR(userId);
    const user = await this.userService.findOne(userId);
    const latestHealthProfile = user.healthProfiles[user.healthProfiles.length - 1];

    let activityMultiplier;
    switch (latestHealthProfile.activityLevel) {
      case 'sedentary': activityMultiplier = 1.2; break;
      case 'lightly_active': activityMultiplier = 1.375; break;
      case 'moderately_active': activityMultiplier = 1.55; break;
      case 'very_active': activityMultiplier = 1.725; break;
      case 'extra_active': activityMultiplier = 1.9; break;
      default: activityMultiplier = 1.2;
    }

    return Math.round(bmr * activityMultiplier);
  }
}