import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, IsDate, IsOptional } from 'class-validator';
import { User } from '../../user/entity/user.entity';
import { HealthProfile } from '../../health/entity/health-profile.entity';
import { Recipe } from './recipe.entity';

@Entity()
export class NutritionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 사용자 및 건강 프로필과의 다대일 관계
  @ManyToOne(() => User, user => user.nutritionPlans)
  user: User;

  @ManyToOne(() => HealthProfile, healthProfile => healthProfile.nutritionPlans)
  healthProfile: HealthProfile;

  // 일일 영양 목표
  @Column('int')
  @IsNotEmpty({ message: '일일 칼로리 목표는 필수입니다.' })
  @IsNumber({}, { message: '일일 칼로리 목표는 숫자여야 합니다.' })
  @Min(500, { message: '일일 칼로리 목표는 최소 500kcal 이상이어야 합니다.' })
  dailyCalorieTarget: number;

  @Column('float')
  @IsNotEmpty({ message: '단백질 목표는 필수입니다.' })
  @IsNumber({}, { message: '단백질 목표는 숫자여야 합니다.' })
  @Min(0, { message: '단백질 목표는 0g 이상이어야 합니다.' })
  proteinTarget: number;

  @Column('float')
  @IsNotEmpty({ message: '탄수화물 목표는 필수입니다.' })
  @IsNumber({}, { message: '탄수화물 목표는 숫자여야 합니다.' })
  @Min(0, { message: '탄수화물 목표는 0g 이상이어야 합니다.' })
  carbTarget: number;

  @Column('float')
  @IsNotEmpty({ message: '지방 목표는 필수입니다.' })
  @IsNumber({}, { message: '지방 목표는 숫자여야 합니다.' })
  @Min(0, { message: '지방 목표는 0g 이상이어야 합니다.' })
  fatTarget: number;

  @Column('simple-array')
  recommendedFoods: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}