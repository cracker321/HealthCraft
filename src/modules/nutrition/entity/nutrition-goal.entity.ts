import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, Max, IsDate, IsEnum, IsOptional } from 'class-validator';
import { User } from '../../user/entity/user.entity';
import { HealthProfile } from '../../health/entity/health-profile.entity';


// NutritionGoal 엔티티:
// 사용자의 영양 목표를 저장하고 관리하는 엔티티
// 목표 유형, 칼로리 및 영양소 목표, 시작일 및 종료일 등을 포함
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

  @Column()
  @IsNotEmpty({ message: '목표 설정 날짜는 필수입니다.' })
  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  startDate: Date;

  @Column({ nullable: true })
  @IsOptional()
  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  endDate?: Date;

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

  @Column('simple-json', { nullable: true })
  @IsOptional()
  additionalNutrients?: { [nutrient: string]: number };

  @Column('text', { nullable: true })
  @IsOptional()
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}