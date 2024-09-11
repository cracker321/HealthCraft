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
  
  // 영양 계획과의 일대다 관계
  @OneToMany(() => NutritionPlan, nutritionPlan => nutritionPlan.healthProfile)
  nutritionPlans: NutritionPlan[];

  @OneToMany(() => NutritionGoal, nutritionGoal => nutritionGoal.healthProfile)
  nutritionGoals: NutritionGoal[];

}