// src/modules/health/service/health.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthProfile } from '../entity/health-profile.entity';
import { HealthCheckup } from '../entity/health-checkup.entity';
import { HealthReport } from '../entity/health-report.entity';

@Injectable()
export class HealthService {
  constructor(
    // 각 건강 관련 엔티티에 대한 TypeORM 리포지토리를 주입받습니다.
    @InjectRepository(HealthProfile)
    private healthProfileRepository: Repository<HealthProfile>,
    @InjectRepository(HealthCheckup)
    private healthCheckupRepository: Repository<HealthCheckup>,
    @InjectRepository(HealthReport)
    private healthReportRepository: Repository<HealthReport>,
  ) {}

  // 사용자의 건강 프로필을 생성하는 메서드
  async createProfile(userId: string, profileData: Partial<HealthProfile>): Promise<HealthProfile> {
    // HealthProfile 엔티티 인스턴스를 생성하고 사용자 ID를 연결합니다.
    const profile = this.healthProfileRepository.create({ ...profileData, user: { id: userId } });
    // 생성된 프로필을 데이터베이스에 저장하고 반환합니다.
    return this.healthProfileRepository.save(profile);
  }

  // 건강 검진 기록을 생성하는 메서드
  async createCheckup(userId: string, checkupData: Partial<HealthCheckup>): Promise<HealthCheckup> {
    // HealthCheckup 엔티티 인스턴스를 생성하고 사용자 ID를 연결합니다.
    const checkup = this.healthCheckupRepository.create({ ...checkupData, user: { id: userId } });
    // 생성된 검진 기록을 데이터베이스에 저장하고 반환합니다.
    return this.healthCheckupRepository.save(checkup);
  }

  // 건강 리포트를 생성하는 메서드
  async generateReport(userId: string): Promise<HealthReport> {
    // TODO: 여기에 실제 리포트 생성 로직을 구현해야 합니다.
    // 예: 최근 건강 검진 결과, 건강 프로필, 영양 목표 등을 종합하여 리포트 생성
    const report = this.healthReportRepository.create({ user: { id: userId } });
    return this.healthReportRepository.save(report);
  }
}