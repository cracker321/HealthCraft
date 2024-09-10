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

}