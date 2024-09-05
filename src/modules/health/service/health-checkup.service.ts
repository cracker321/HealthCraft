// src/modules/health/service/health-checkup.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthCheckup } from '../entity/health-checkup.entity';
import { CreateHealthCheckupDto } from '../dto/create-health-checkup.dto';
import { UserService } from '../../user/service/user.service';

// 건강 체크업 관련 비즈니스 로직을 처리하는 서비스
@Injectable()
export class HealthCheckupService {
  constructor(
    @InjectRepository(HealthCheckup)
    private healthCheckupRepository: Repository<HealthCheckup>,
    private userService: UserService
  ) {}

  // 건강 체크업 기록 생성 메소드
  async create(userId: string, createHealthCheckupDto: CreateHealthCheckupDto): Promise<HealthCheckup> {
    const user = await this.userService.findOne(userId);
    const healthCheckup = this.healthCheckupRepository.create({
      ...createHealthCheckupDto,
      user
    });
    return this.healthCheckupRepository.save(healthCheckup);
  }

  // 사용자의 최근 건강 체크업 조회 메소드
  async findLatestByUserId(userId: string): Promise<HealthCheckup> {
    const checkup = await this.healthCheckupRepository.findOne({
      where: { user: { id: userId } },
      order: { checkupDate: 'DESC' }
    });
    if (!checkup) {
      throw new NotFoundException('No health checkup found for this user');
    }
    return checkup;
  }

  // 건강 체크업 리포트 생성 메소드
  async generateReport(userId: string): Promise<any> {
    const latestCheckup = await this.findLatestByUserId(userId);
    return {
      checkupDate: latestCheckup.checkupDate,
      bmi: this.calculateBMI(latestCheckup.height, latestCheckup.weight),
      healthStatus: this.evaluateHealthStatus(latestCheckup),
      recommendations: this.generateRecommendations(latestCheckup)
    };
  }

  // BMI 계산 메소드
  private calculateBMI(height: number, weight: number): number {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  }

  // 건강 상태 평가 메소드
  private evaluateHealthStatus(checkup: HealthCheckup): string {
    const bmi = this.calculateBMI(checkup.height, checkup.weight);
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }

  // 건강 개선 권장사항 생성 메소드
  private generateRecommendations(checkup: HealthCheckup): string[] {
    const recommendations: string[] = [];
    const bmi = this.calculateBMI(checkup.height, checkup.weight);

    if (bmi < 18.5) {
      recommendations.push('Consider increasing your calorie intake');
      recommendations.push('Consult with a nutritionist for a balanced diet plan');
    } else if (bmi >= 25) {
      recommendations.push('Consider reducing your calorie intake');
      recommendations.push('Increase physical activity');
    }

    if (checkup.systolicBP > 120 || checkup.diastolicBP > 80) {
      recommendations.push('Monitor your blood pressure regularly');
      recommendations.push('Reduce salt intake');
    }

    if (checkup.cholesterol > 200) {
      recommendations.push('Limit foods high in saturated fats');
      recommendations.push('Increase consumption of fruits and vegetables');
    }

    return recommendations;
  }
}