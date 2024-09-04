// src/modules/exercise/service/exercise.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseRecord } from '../entity/exercise-record.entity';

@Injectable()
export class ExerciseService {
  constructor(
    // ExerciseRecord 엔티티에 대한 TypeORM 리포지토리를 주입받습니다.
    @InjectRepository(ExerciseRecord)
    private exerciseRecordRepository: Repository<ExerciseRecord>,
  ) {}

  // 운동 기록을 저장하는 메서드
  async recordExercise(userId: string, exerciseData: Partial<ExerciseRecord>): Promise<ExerciseRecord> {
    // ExerciseRecord 엔티티 인스턴스를 생성하고 사용자 ID를 연결합니다.
    const exercise = this.exerciseRecordRepository.create({ ...exerciseData, user: { id: userId } });
    // 생성된 운동 기록을 데이터베이스에 저장하고 반환합니다.
    return this.exerciseRecordRepository.save(exercise);
  }

  // 사용자의 운동 기록을 조회하는 메서드
  async getExerciseHistory(userId: string): Promise<ExerciseRecord[]> {
    // 지정된 사용자 ID의 모든 운동 기록을 조회하여 반환합니다.
    return this.exerciseRecordRepository.find({ where: { user: { id: userId } } });
  }
}