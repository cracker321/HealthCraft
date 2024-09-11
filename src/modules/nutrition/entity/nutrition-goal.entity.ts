import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, Max, IsDate, IsEnum, IsOptional } from 'class-validator';
import { User } from '../../user/entity/user.entity';
import { HealthProfile } from '../../health/entity/health-profile.entity';


// NutritionGoal 엔티티:

@Entity()
export class NutritionGoal {
  // 'uuid'를 문자열로 변경
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 사용자와의 다대일 관계
  @ManyToOne(() => User, user => user.nutritionGoals)
    user: User;
    
  @ManyToOne(() => HealthProfile, healthProfile => healthProfile.nutritionGoals)
  healthProfile: HealthProfile;

  @Column('int')
  @IsNumber({}, { message: '일일 목표 칼로리는 숫자여야 합니다.' })
  @Min(1000, { message: '일일 목표 칼로리는 최소 1000kcal 이상이어야 합니다.' })
  @Max(5000, { message: '일일 목표 칼로리는 최대 5000kcal 이하여야 합니다.' })
  dailyCalorieTarget: number;

  @Column('float')
  @IsNumber({}, { message: '단백질 목표는 숫자여야 합니다.' })
  @Min(0, { message: '단백질 목표는 0g 이상이어야 합니다.' })
  proteinTarget: number;

  @Column('float')
  @IsNumber({}, { message: '탄수화물 목표는 숫자여야 합니다.' })
  @Min(0, { message: '탄수화물 목표는 0g 이상이어야 합니다.' })
  carbTarget: number;

  @Column('float')
  @IsNumber({}, { message: '지방 목표는 숫자여야 합니다.' })
  @Min(0, { message: '지방 목표는 0g 이상이어야 합니다.' })
  fatTarget: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}