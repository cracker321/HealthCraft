// src/modules/exercise-recommendation/service/exercise-recommendation.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from '../entity/exercise.entity';
import { UserService } from '../../user/service/user.service';
import { HealthService } from '../../health/service/health.service';

@Injectable()
export class ExerciseRecommendationService {
  constructor(
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
    private userService: UserService,
    private healthService: HealthService
  ) {}

  // 사용자 맞춤 운동 추천 메서드
  async getPersonalizedExercises(userId: string): Promise<Exercise[]> {
    // 사용자 정보와 최신 건강 프로필을 조회합니다.
    const user = await this.userService.findOne(userId);
    const healthProfile = await this.healthService.getLatestHealthProfile(userId);

    // 사용자의 활동 수준에 따라 운동 강도를 결정합니다.
    let intensityLevel: string;
    if (healthProfile.activityLevel === 'sedentary') intensityLevel = 'low';
    else if (healthProfile.activityLevel === 'moderately_active') intensityLevel = 'medium';
    else intensityLevel = 'high';

    // 사용자의 건강 목표와 운동 강도에 맞는 운동을 5개 추천합니다.
    return this.exerciseRepository.find({
      where: { 
        intensityLevel, 
        suitableFor: healthProfile.healthGoal 
      },
      take: 5
    });
  }

  // 특정 근육군을 타겟팅하는 운동 추천 메서드
  async getExercisesForMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
    // 지정된 근육군을 타겟팅하는 운동을 5개 추천합니다.
    return this.exerciseRepository.find({
      where: { targetMuscleGroups: muscleGroup },
      take: 5
    });
  }

  // 칼로리 소모량 기반 운동 추천 메서드
  async getExercisesByCalorieBurn(targetCalories: number): Promise<Exercise[]> {
    // 목표 칼로리 소모량에 가장 근접한 운동을 5개 추천합니다.
    return this.exerciseRepository.find({
      order: {
        caloriesBurnedPerHour: 'DESC'
      },
      where: {
        caloriesBurnedPerHour: targetCalories
      },
      take: 5
    });
  }

  // 새로운 운동 추가 메서드
  async addExercise(exerciseData: Partial<Exercise>): Promise<Exercise> {
    const exercise = this.exerciseRepository.create(exerciseData);
    return this.exerciseRepository.save(exercise);
  }

  // 운동 정보 업데이트 메서드
  async updateExercise(id: string, exerciseData: Partial<Exercise>): Promise<Exercise> {
    await this.exerciseRepository.update(id, exerciseData);
    return this.exerciseRepository.findOne({ where: { id } });
  }

  // 운동 삭제 메서드
  async deleteExercise(id: string): Promise<void> {
    await this.exerciseRepository.delete(id);
  }
}