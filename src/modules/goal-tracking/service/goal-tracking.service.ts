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
    // 사용자 정보를 조회합니다.
    const user = await this.userService.findOne(userId);
    // HealthGoal 엔티티 인스턴스를 생성하고 사용자 정보를 연결합니다.
    const goal = this.healthGoalRepository.create({ ...goalData, user });
    // 생성된 목표를 데이터베이스에 저장하고 반환합니다.
    return this.healthGoalRepository.save(goal);
  }

  // 목표 진행 상황 업데이트 메서드
  async updateGoalProgress(goalId: string, progressData: Partial<GoalProgress>): Promise<GoalProgress> {
    // 지정된 목표를 조회합니다.
    const goal = await this.healthGoalRepository.findOne({ where: { id: goalId } });
    // GoalProgress 엔티티 인스턴스를 생성하고 목표 정보를 연결합니다.
    const progress = this.goalProgressRepository.create({ ...progressData, goal });
    // 생성된 진행 상황을 데이터베이스에 저장하고 반환합니다.
    return this.goalProgressRepository.save(progress);
  }

  // 목표 달성률 계산 메서드
  async calculateGoalAchievement(goalId: string): Promise<number> {
    // 목표와 관련된 모든 진행 상황을 조회합니다.
    const goal = await this.healthGoalRepository.findOne({
      where: { id: goalId },
      relations: ['progresses']
    });

    if (!goal || !goal.progresses.length) return 0;

    // 가장 최근의 진행 상황을 기준으로 달성률을 계산합니다.
    const latestProgress = goal.progresses[goal.progresses.length - 1];
    return (latestProgress.currentValue / goal.targetValue) * 100;
  }

  // 사용자의 모든 목표 조회 메서드
  async getUserGoals(userId: string): Promise<HealthGoal[]> {
    // 사용자의 모든 건강 목표를 조회하여 반환합니다.
    return this.healthGoalRepository.find({
      where: { user: { id: userId } },
      relations: ['progresses']
    });
  }

  // 목표 달성 추천사항 제공 메서드
  async getGoalRecommendations(goalId: string): Promise<string[]> {
    // 지정된 목표를 조회합니다.
    const goal = await this.healthGoalRepository.findOne({ where: { id: goalId } });
    // 목표 달성률을 계산합니다.
    const achievement = await this.calculateGoalAchievement(goalId);

    const recommendations = [];

    // 달성률에 따라 다른 추천사항을 제공합니다.
    if (achievement < 50) {
      recommendations.push("목표를 더 작은 단계로 나누어 보세요");
      recommendations.push("매일 목표를 위해 노력하는 시간을 정해보세요");
    } else if (achievement < 80) {
      recommendations.push("잘 하고 있습니다! 현재의 습관을 유지하세요");
      recommendations.push("작은 성과도 축하하며 동기부여를 해보세요");
    } else {
      recommendations.push("목표 달성이 눈앞입니다! 마지막 힘을 내세요");
      recommendations.push("다음 목표를 생각해보는 것은 어떨까요?");
    }

    // 목표 카테고리에 따른 추가 추천사항을 제공합니다.
    recommendations.push(`${goal.category} 활동의 일관성을 유지하세요`);
    return recommendations;
  }
}