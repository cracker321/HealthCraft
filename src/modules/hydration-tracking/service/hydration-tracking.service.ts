// src/modules/hydration-tracking/service/hydration-tracking.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { HydrationRecord } from '../entity/hydration-record.entity';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class HydrationTrackingService {
  constructor(
    @InjectRepository(HydrationRecord)
    private hydrationRecordRepository: Repository<HydrationRecord>,
    private userService: UserService
  ) {}

  // 수분 섭취 기록 추가 메서드
  async addHydrationRecord(userId: string, data: Partial<HydrationRecord>): Promise<HydrationRecord> {
    // 사용자 정보를 조회합니다.
    const user = await this.userService.findOne(userId);
    // HydrationRecord 엔티티 인스턴스를 생성하고 사용자 정보를 연결합니다.
    const record = this.hydrationRecordRepository.create({ ...data, user });
    // 생성된 기록을 데이터베이스에 저장하고 반환합니다.
    return this.hydrationRecordRepository.save(record);
  }

  // 일일 수분 섭취량 조회 메서드
  async getDailyHydration(userId: string, date: Date): Promise<number> {
    // 주어진 날짜의 시작과 끝을 설정합니다.
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    // 해당 날짜의 수분 섭취 기록을 조회합니다.
    const records = await this.hydrationRecordRepository.find({
      where: {
        user: { id: userId },
        timestamp: Between(startOfDay, endOfDay)
      }
    });

    // 총 수분 섭취량을 계산하여 반환합니다.
    return records.reduce((total, record) => total + record.amount, 0);
  }

  // 수분 섭취 목표 달성률 계산 메서드
  async calculateHydrationGoalProgress(userId: string, date: Date): Promise<number> {
    // 일일 수분 섭취량을 조회합니다.
    const dailyHydration = await this.getDailyHydration(userId, date);
    // 사용자 정보를 조회합니다.
    const user = await this.userService.findOne(userId);
    // 사용자의 수분 섭취 목표를 가져옵니다. 기본값은 2000ml입니다.
    const hydrationGoal = user.hydrationGoal || 2000;
    
    // 목표 대비 달성률을 계산하여 반환합니다.
    return (dailyHydration / hydrationGoal) * 100;
  }

  // 수분 섭취 추천 메서드
  async getHydrationRecommendations(userId: string): Promise<string[]> {
    // 사용자 정보를 조회합니다.
    const user = await this.userService.findOne(userId);
    // 기본적인 수분 섭취 추천 사항을 설정합니다.
    const recommendations = [
      "아침에 일어나자마자 물 한 잔 마시기",
      "하루 종일 물병을 가지고 다니기",
      "매 시간마다 물 마시는 알림 설정하기",
    ];

    // 활동량이 많은 사용자에게는 추가 권장사항을 제공합니다.
    if (user.activityLevel === 'high') {
      recommendations.push("운동 전, 운동 중, 운동 후에 물 섭취량 늘리기");
    }

    return recommendations;
  }
}