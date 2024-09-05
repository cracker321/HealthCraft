// src/modules/health/service/health-report.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthReport } from '../entity/health-report.entity';
import { User } from '../../user/entity/user.entity';
import { HealthCheckup } from '../entity/health-checkup.entity';
import { HealthCheckupService } from './health-checkup.service';

@Injectable()
export class HealthReportService {
  constructor(
    @InjectRepository(HealthReport)
    private healthReportRepository: Repository<HealthReport>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private healthCheckupService: HealthCheckupService
  ) {}

  async generateReport(userId: string): Promise<HealthReport> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    const latestCheckup = await this.healthCheckupService.findLatestByUserId(userId);
    if (!latestCheckup) {
      throw new Error('No health checkup found');
    }

    const report = this.healthReportRepository.create({
      user,
      latestCheckup,
      overallHealthStatus: this.calculateOverallHealth(latestCheckup),
      healthMetrics: this.calculateHealthMetrics(latestCheckup),
      improvements: this.generateImprovements(latestCheckup),
      risks: this.generateRisks(latestCheckup),
      recommendations: this.generateRecommendations(latestCheckup)
    });

    return this.healthReportRepository.save(report);
  }

  private calculateOverallHealth(checkup: HealthCheckup): string {
    // 전체적인 건강 상태 계산 로직
    return 'Good';
  }

  private calculateHealthMetrics(checkup: HealthCheckup): any {
    // 건강 지표 계산 로직
    return {
      bmi: 22,
      bloodPressureStatus: 'Normal',
      cholesterolStatus: 'Normal',
      bloodSugarStatus: 'Normal'
    };
  }

  private generateImprovements(checkup: HealthCheckup): string[] {
    // 개선사항 생성 로직
    return ['Increase daily water intake', 'Exercise more regularly'];
  }

  private generateRisks(checkup: HealthCheckup): string[] {
    // 건강 위험 생성 로직
    return ['Slightly elevated blood pressure'];
  }

  private generateRecommendations(checkup: HealthCheckup): any {
    // 권장사항 생성 로직
    return {
      diet: ['Reduce salt intake', 'Increase vegetable consumption'],
      exercise: ['30 minutes of moderate exercise daily'],
      lifestyle: ['Practice stress-reduction techniques']
    };
  }
}