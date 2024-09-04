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
    const user = await this.userService.findOne(userId);
    const record = this.hydrationRecordRepository.create({ ...data, user });
    return this.hydrationRecordRepository.save(record);
  }

  // 일일 수분 섭취량 조회 메서드
  async getDailyHydration(userId: string, date: Date): Promise<number> {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const records = await this.hydrationRecordRepository.find({
      where: {
        user: { id: userId },
        timestamp: Between(startOfDay, endOfDay)
      }
    });

    return records.reduce((total, record) => total + record.amount, 0);
  }

  // 수분 섭취 목표 달성률 계산 메서드
  async calculateHydrationGoalProgress(userId: string, date: Date): Promise<number> {
    const dailyHydration = await this.getDailyHydration(userId, date);
    const user = await this.userService.findOne(userId);
    const hydrationGoal = user.hydrationGoal || 2000; // 기본값 2000ml
    
    return (dailyHydration / hydrationGoal) * 100;
  }

  // 수분 섭취 추천 메서드
  async getHydrationRecommendations(userId: string): Promise<string[]> {
    const user = await this.userService.findOne(userId);
    const recommendations = [
      "아침에 일어나자마자 물 한 잔 마시기",
      "하루 종일 물병을 가지고 다니기",
      "매 시간마다 물 마시는 알림 설정하기",
    ];

    if (user.activityLevel === 'high') {
      recommendations.push("운동 전, 운동 중, 운동 후에 물 섭취량 늘리기");
    }

    return recommendations;
  }

  // 수분 섭취 목표 설정 메서드
  async setHydrationGoal(userId: string, goal: number): Promise<void> {
    const user = await this.userService.findOne(userId);
    user.hydrationGoal = goal;
    await this.userService.update(userId, user);
  }

  // 주간 수분 섭취 통계 조회 메서드
  async getWeeklyHydrationStats(userId: string): Promise<any> {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const records = await this.hydrationRecordRepository.find({
      where: {
        user: { id: userId },
        timestamp: Between(startDate, endDate)
      }
    });

    const dailyStats = {};
    records.forEach(record => {
      const day = record.timestamp.toISOString().split('T')[0];
      dailyStats[day] = (dailyStats[day] || 0) + record.amount;
    });

    return dailyStats;
  }
}