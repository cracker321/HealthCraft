// src/modules/exercise-tracking/service/exercise-tracking.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ExerciseRecord } from '../entity/exercise-record.entity';
import { UserService } from '../../user/service/user.service';
import { CreateExerciseRecordDto } from '../dto/create-exercise-record.dto';
import { UpdateExerciseRecordDto } from '../dto/update-exercise-record.dto';

@Injectable()
export class ExerciseTrackingService {
  constructor(
    @InjectRepository(ExerciseRecord)
    private exerciseRecordRepository: Repository<ExerciseRecord>,
    private userService: UserService
  ) {}

  // 운동 기록 추가 메서드
  async addExerciseRecord(userId: string, createExerciseRecordDto: CreateExerciseRecordDto): Promise<ExerciseRecord> {
    const user = await this.userService.findOne(userId);
    const record = this.exerciseRecordRepository.create({ ...createExerciseRecordDto, user });

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

    // 여기에 주간 통계 계산 로직 추가
    // 예: 총 운동 시간, 총 소모 칼로리, 운동 유형별 분포 등

    return {
      totalExerciseTime: records.reduce((sum, record) => sum + record.duration, 0),
      totalCaloriesBurned: records.reduce((sum, record) => sum + record.caloriesBurned, 0),
      // 기타 통계...
    };
  }

  // 운동 기록 업데이트 메서드
  async updateExerciseRecord(recordId: string, updateExerciseRecordDto: UpdateExerciseRecordDto): Promise<ExerciseRecord> {
    await this.exerciseRecordRepository.update(recordId, updateExerciseRecordDto);
    return this.exerciseRecordRepository.findOne({ where: { id: recordId } });
  }

  // 운동 기록 삭제 메서드
  async deleteExerciseRecord(recordId: string): Promise<void> {
    await this.exerciseRecordRepository.delete(recordId);
  }
}