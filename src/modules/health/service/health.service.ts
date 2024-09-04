// src/modules/health/service/health.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthProfile } from '../entity/health-profile.entity';
import { HealthCheckup } from '../entity/health-checkup.entity';
import { HealthReport } from '../entity/health-report.entity';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(HealthProfile)
    private healthProfileRepository: Repository<HealthProfile>,
    @InjectRepository(HealthCheckup)
    private healthCheckupRepository: Repository<HealthCheckup>,
    @InjectRepository(HealthReport)
    private healthReportRepository: Repository<HealthReport>,
    private userService: UserService
  ) {}

  // 사용자의 건강 프로필을 생성하는 메서드
  async createProfile(userId: string, profileData: Partial<HealthProfile>): Promise<HealthProfile> {
    const user = await this.userService.findOne(userId);
    const profile = this.healthProfileRepository.create({ ...profileData, user });
    return this.healthProfileRepository.save(profile);
  }

  // 건강 검진 기록을 생성하는 메서드
  async createCheckup(userId: string, checkupData: Partial<HealthCheckup>): Promise<HealthCheckup> {
    const user = await this.userService.findOne(userId);
    const checkup = this.healthCheckupRepository.create({ ...checkupData, user });
    return this.healthCheckupRepository.save(checkup);
  }

  // 건강 리포트를 생성하는 메서드
  async generateReport(userId: string): Promise<HealthReport> {
    const user = await this.userService.findOne(userId);
    const latestCheckup = await this.healthCheckupRepository.findOne({
      where: { user: { id: userId } },
      order: { checkupDate: 'DESC' }
    });
    const latestProfile = await this.healthProfileRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' }
    });

    const report = this.healthReportRepository.create({
      user,
      latestCheckup,
      reportDate: new Date(),
      overallHealthStatus: this.calculateOverallHealth(latestCheckup, latestProfile),
      recommendations: this.generateRecommendations(latestCheckup, latestProfile)
    });

    return this.healthReportRepository.save(report);
  }

  // 최신 건강 프로필을 조회하는 메서드
  async getLatestHealthProfile(userId: string): Promise<HealthProfile> {
    return this.healthProfileRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' }
    });
  }

  private calculateOverallHealth(checkup: HealthCheckup, profile: HealthProfile): string {
    // 전반적인 건강 상태를 계산하는 로직 구현
    // ...
  }

  private generateRecommendations(checkup: HealthCheckup, profile: HealthProfile): string[] {
    // 건강 개선 권장사항을 생성하는 로직 구현
    // ...
  }
}