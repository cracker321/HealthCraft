// src/modules/exercise-tracking/service/exercise-tracking.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ExerciseRecord } from '../entity/exercise-record.entity';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class ExerciseTrackingService {
  constructor(
    @InjectRepository(ExerciseRecord)
    private exerciseRecordRepository: Repository<ExerciseRecord>,
    private userService: UserService
  ) {}

  // 운동 기록 추가 메서드
  async addExerciseRecord(userId: string, data: Partial<ExerciseRecord>): Promise<ExerciseRecord> {
    const user = await this.userService.findOne(userId);
    const record = this.exerciseRecordRepository.create({ ...data, user });
    
    // 사용자의 체중을 가져와 칼로리 소모량 계산
    if (user.weight) {
      record.caloriesBurned = record.calculateCaloriesBurned(user.weight);
    }

    // 사용자의 최대 심박수를 계산하고 운동 강도 결정
    if (user.age) {
      const maxHeartRate = 220 - user.age;
      record.determineIntensity(maxHeartRate);
    }

    return this.exerciseRecordRepository.save(record);
  }

  // 일일 운동량 조회 메서드
  async getDailyExercise(userId: string, date: Date): Promise<ExerciseRecord[]> {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    return this.exerciseRecordRepository.find({
      where: {
        user: { id: userId },
        exerciseDate: Between(startOfDay, endOfDay)
      }
    });
  }

  // 주간 운동 통계 조회 메서드
  async getWeeklyExerciseStats(userId: string): Promise<any> {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const records = await this.exerciseRecordRepository.find({
      where: {
        user: { id: userId },
        exerciseDate: Between(startDate, endDate)
      }
    });

    // 주간 통계 계산 로직
    const stats = {
      totalDuration: 0,
      totalCaloriesBurned: 0,
      exercisesByType: {}
    };

    records.forEach(record => {
      stats.totalDuration += record.duration;
      stats.totalCaloriesBurned += record.caloriesBurned;
      if (!stats.exercisesByType[record.exerciseType]) {
        stats.exercisesByType[record.exerciseType] = 0;
      }
      stats.exercisesByType[record.exerciseType] += record.duration;
    });

    return stats;
  }

  // 운동 추천 메서드
  async getExerciseRecommendations(userId: string): Promise<string[]> {
    const user = await this.userService.findOne(userId);
    const recommendations = [
      "매일 30분 이상 걷기",
      "주 3회 이상 유산소 운동하기",
      "주 2회 이상 근력 운동하기"
    ];

    // 사용자의 건강 상태나 목표에 따라 추가 추천사항 생성
    if (user.healthGoal === 'weight_loss') {
      recommendations.push("고강도 인터벌 트레이닝 시도해보기");
    } else if (user.healthGoal === 'muscle_gain') {
      recommendations.push("단백질 섭취량 늘리기");
    }

    return recommendations;
  }

  // 운동 기록 업데이트 메서드
  async updateExerciseRecord(recordId: string, updateData: Partial<ExerciseRecord>): Promise<ExerciseRecord> {
    await this.exerciseRecordRepository.update(recordId, updateData);
    return this.exerciseRecordRepository.findOne({ where: { id: recordId } });
  }

  // 운동 기록 삭제 메서드
  async deleteExerciseRecord(recordId: string): Promise<void> {
    await this.exerciseRecordRepository.delete(recordId);
  }
}