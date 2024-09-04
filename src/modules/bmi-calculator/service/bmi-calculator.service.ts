// src/modules/bmi-calculator/service/bmi-calculator.service.ts
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class BMICalculatorService {
  constructor(private userService: UserService) {}

  // BMI를 계산하는 메서드
  async calculateBMI(userId: string): Promise<number> {
    const user = await this.userService.findOne(userId);
    const latestHealthProfile = user.healthProfiles[user.healthProfiles.length - 1];

    const heightInMeters = latestHealthProfile.height / 100;
    const bmi = latestHealthProfile.weight / (heightInMeters * heightInMeters);

    return Number(bmi.toFixed(2));
  }

  // BMI 카테고리를 결정하는 메서드
  getBMICategory(bmi: number): string {
    if (bmi < 18.5) return '저체중';
    if (bmi < 25) return '정상';
    if (bmi < 30) return '과체중';
    return '비만';
  }
}