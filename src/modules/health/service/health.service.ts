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
      overallHealthStatus: this.calculateOverallHealth(latestCheckup, latestProfile),
      healthMetrics: this.calculateHealthMetrics(latestCheckup),
      improvements: this.generateImprovements(latestCheckup, latestProfile),
      risks: this.generateRisks(latestCheckup, latestProfile),
      recommendations: this.generateRecommendations(latestCheckup, latestProfile)
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

  // 전반적인 건강 상태 계산 메서드 (예시)
  private calculateOverallHealth(checkup: HealthCheckup, profile: HealthProfile): string {
    // 실제 구현에서는 여러 요소를 고려하여 건강 상태를 계산해야 함
    return 'Good';
  }

  // 건강 지표 계산 메서드 (예시)
  private calculateHealthMetrics(checkup: HealthCheckup): HealthReport['healthMetrics'] {
    // 실제 구현에서는 체크업 결과를 바탕으로 각 지표를 계산해야 함
    return {
      bmi: 22,
      bloodPressureStatus: 'Normal',
      cholesterolStatus: 'Normal',
      bloodSugarStatus: 'Normal'
    };
  }

  // 개선사항 생성 메서드 (예시)
  private generateImprovements(checkup: HealthCheckup, profile: HealthProfile): string[] {
    // 실제 구현에서는 체크업 결과와 프로필을 분석하여 개선사항을 생성해야 함
    return ['Increase daily water intake', 'Exercise more regularly'];
  }

  // 건강 위험 생성 메서드 (예시)
  private generateRisks(checkup: HealthCheckup, profile: HealthProfile): string[] {
    // 실제 구현에서는 체크업 결과와 프로필을 분석하여 건강 위험을 식별해야 함
    return ['Slightly elevated blood pressure'];
  }

  // 권장사항 생성 메서드 (예시)
  private generateRecommendations(checkup: HealthCheckup, profile: HealthProfile): HealthReport['recommendations'] {
    // 실제 구현에서는 체크업 결과와 프로필을 바탕으로 맞춤형 권장사항을 생성해야 함
    return {
      diet: ['Reduce salt intake', 'Increase vegetable consumption'],
      exercise: ['30 minutes of moderate exercise daily'],
      lifestyle: ['Practice stress-reduction techniques']
    };
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

  // 건강 체크업 기록 메서드 수정
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

  // 이전 검진과 비교 메서드
  async compareWithPreviousCheckup(userId: string): Promise<{ [key: string]: number } | null> {
    const checkups = await this.healthCheckupRepository.find({
      where: { user: { id: userId } },
      order: { checkupDate: 'DESC' },
      take: 2
    });

    if (checkups.length < 2) {
      return null; // 비교할 이전 검진 기록이 없음
    }

    return checkups[0].compareWithPrevious(checkups[1]);
  } 

}