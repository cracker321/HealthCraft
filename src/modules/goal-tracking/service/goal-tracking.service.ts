// src/modules/goal-tracking/service/goal-tracking.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthGoal } from '../entity/health-goal.entity';
import { GoalProgress } from '../entity/goal-progress.entity';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class GoalTrackingService {
  constructor(
    @InjectRepository(HealthGoal)
    private healthGoalRepository: Repository<HealthGoal>,
    @InjectRepository(GoalProgress)
    private goalProgressRepository: Repository<GoalProgress>,
    private userService: UserService
  ) {}

  // 건강 목표 설정 메서드
  async setHealthGoal(userId: string, goalData: Partial<HealthGoal>): Promise<HealthGoal> {
    const user = await this.userService.findOne(userId);
    const goal = this.healthGoalRepository.create({ ...goalData, user });
    return this.healthGoalRepository.save(goal);
  }

  // 목표 진행 상황 업데이트 메서드
  async updateGoalProgress(goalId: string, progressData: Partial<GoalProgress>): Promise<GoalProgress> {
    const goal = await this.healthGoalRepository.findOne({ where: { id: goalId } });
    const progress = this.goalProgressRepository.create({ ...progressData, goal });
    return this.goalProgressRepository.save(progress);
  }

  // 목표 달성률 계산 메서드
  async calculateGoalAchievement(goalId: string): Promise<number> {
    const goal = await this.healthGoalRepository.findOne({
      where: { id: goalId },
      relations: ['progresses']
    });

    if (!goal || !goal.progresses.length) return 0;

    const latestProgress = goal.progresses[goal.progresses.length - 1];
    return (latestProgress.currentValue / goal.targetValue) * 100;
  }

  // 사용자의 모든 목표 조회 메서드
  async getUserGoals(userId: string): Promise<HealthGoal[]> {
    return this.healthGoalRepository.find({
      where: { user: { id: userId } },
      relations: ['progresses']
    });
  }
}