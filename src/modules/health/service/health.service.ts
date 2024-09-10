// src/modules/health/health.service.ts

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

  // 건강 프로필 생성 메서드
  async createProfile(userId: string, profileData: Partial<HealthProfile>): Promise<HealthProfile> {
    const user = await this.userService.findOne(userId);
    const profile = this.healthProfileRepository.create({ ...profileData, user });
    return this.healthProfileRepository.save(profile);
  }

  // 건강 검진 기록 생성 메서드
  async createCheckup(userId: string, checkupData: Partial<HealthCheckup>): Promise<HealthCheckup> {
    const user = await this.userService.findOne(userId);
    const checkup = this.healthCheckupRepository.create({ ...checkupData, user });
    return this.healthCheckupRepository.save(checkup);
  }

  // 건강 리포트 생성 메서드
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
    // 건강 리포트 생성 및 저장
    const report = this.healthReportRepository.create({
      user,
      latestCheckup,
    });
    return this.healthReportRepository.save(report);
  }

  // 최신 건강 프로필 조회 메서드
  async getLatestHealthProfile(userId: string): Promise<HealthProfile> {
    return this.healthProfileRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' }
    });
  }

   // BMI 계산 메서드
   async calculateBMI(userId: string): Promise<number> {
    const profile = await this.getLatestHealthProfile(userId);
    if (!profile || !profile.height || !profile.weight) {
      throw new Error('사용자의 키와 몸무게 정보가 필요합니다.');
    }
    const heightInMeters = profile.height / 100;
    return profile.weight / (heightInMeters * heightInMeters);
  }

  // 건강 검진 기록 메서드 수정
  async recordCheckup(userId: string, checkupData: Partial<HealthCheckup>): Promise<HealthCheckup> {
    const user = await this.userService.findOne(userId);
    const checkup = this.healthCheckupRepository.create({
      ...checkupData,
      user,
      checkupDate: checkupData.checkupDate || new Date(), // checkupDate가 제공되지 않은 경우 현재 날짜 사용
    });
    return this.healthCheckupRepository.save(checkup);
  }

  // 건강 상태 평가 메서드
  async evaluateHealthStatus(userId: string): Promise<{ bloodPressure: string; cholesterol: string; bloodSugar: string }> {
    const latestCheckup = await this.healthCheckupRepository.findOne({
      where: { user: { id: userId } },
      order: { checkupDate: 'DESC' }
    });

    if (!latestCheckup) {
      throw new Error('건강 검진 기록이 없습니다.');
    }

    return latestCheckup.evaluateHealthStatus();
  }


}