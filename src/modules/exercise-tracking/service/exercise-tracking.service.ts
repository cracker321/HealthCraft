// src/modules/exercise-tracking/service/exercise-tracking.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    return this.exerciseRecordRepository.save(record);
  }

  // 일일 운동량 조회 메서드
  async getDailyExercise(userId: string, date: Date): Promise<ExerciseRecord[]> {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    return this.exerciseRecordRepository.find({
      where: {
        user: { id: userId },
        timestamp: Between(startOfDay, endOfDay)
      }
    });
  }

  // 주간 운동 통계 조회 메서드
  async getWeeklyExerciseStats(userId: string): Promise<any> {
    // 주간 운동 통계 계산 로직
    // ...
  }
}