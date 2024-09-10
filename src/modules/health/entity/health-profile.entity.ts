// src/modules/health/entity/health-profile.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, Max, IsEnum } from 'class-validator';
import { User } from '../../user/entity/user.entity';
import { NutritionPlan } from '../../nutrition/entity/nutrition-plan.entity';
import { NutritionGoal } from '../../nutrition/entity/nutrition-goal.entity';

@Entity()
export class HealthProfile {
  // 고유 식별자
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 사용자와의 다대일 관계
  @ManyToOne(() => User, user => user.healthProfiles)
  user: User;

  // 키 정보
  @Column('float')
  @IsNotEmpty({ message: '키는 필수 입력 항목입니다.' })
  @IsNumber({}, { message: '키는 숫자여야 합니다.' })
  @Min(0, { message: '키는 0보다 커야 합니다.' })
  @Max(300, { message: '키는 300cm를 초과할 수 없습니다.' })
  height: number;

  // 체중 정보
  @Column('float')
  @IsNotEmpty({ message: '체중은 필수 입력 항목입니다.' })
  @IsNumber({}, { message: '체중은 숫자여야 합니다.' })
  @Min(0, { message: '체중은 0보다 커야 합니다.' })
  @Max(500, { message: '체중은 500kg을 초과할 수 없습니다.' })
  weight: number;


  // BMI 정보
  @Column('float')
  bmi: number;

  // BMR 정보
  @Column('float')
  bmr: number;

  // 체지방률 정보 (선택적)
  @Column('float', { nullable: true })
  @IsNumber({}, { message: '체지방률은 숫자여야 합니다.' })
  @Min(0, { message: '체지방률은 0% 이상이어야 합니다.' })
  @Max(100, { message: '체지방률은 100%를 초과할 수 없습니다.' })
  bodyFatPercentage?: number;

  // 근육량 정보 (선택적)
  @Column('float', { nullable: true })
  @IsNumber({}, { message: '근육량은 숫자여야 합니다.' })
  @Min(0, { message: '근육량은 0kg 이상이어야 합니다.' })
  muscleMass?: number;

  // 활동 수준
  @Column()
  @IsEnum(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'], 
    { message: '유효한 활동 수준을 선택해주세요.' })
  activityLevel: string;

  // 건강 목표
  @Column()
  @IsEnum(['weight_loss', 'muscle_gain', 'maintenance', 'general_health'], 
    { message: '유효한 건강 목표를 선택해주세요.' })
  healthGoal: string;

  // 영양 계획과의 일대다 관계
  @OneToMany(() => NutritionPlan, nutritionPlan => nutritionPlan.healthProfile)
  nutritionPlans: NutritionPlan[];

  @OneToMany(() => NutritionGoal, nutritionGoal => nutritionGoal.healthProfile)
  nutritionGoals: NutritionGoal[];

    
  // 생성 일자
  @CreateDateColumn()
  createdAt: Date;

  // 수정 일자
  @UpdateDateColumn()
  updatedAt: Date;

  // BMI 계산 메서드
  calculateBMI() {
    this.bmi = this.weight / ((this.height / 100) ** 2);
  }

  // 일일 칼로리 요구량 계산 메서드
  calculateDailyCalorieNeeds(): number {
    let activityFactor;
    switch (this.activityLevel) {
      case 'sedentary': activityFactor = 1.2; break;
      case 'lightly_active': activityFactor = 1.375; break;
      case 'moderately_active': activityFactor = 1.55; break;
      case 'very_active': activityFactor = 1.725; break;
      case 'extra_active': activityFactor = 1.9; break;
      default: activityFactor = 1.2;
    }
    return this.bmr * activityFactor;
  }
}