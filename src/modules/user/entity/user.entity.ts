import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsDate, IsEnum } from 'class-validator';
import { Exclude } from 'class-transformer';
import { HealthProfile } from '../../health/entity/health-profile.entity';
import { NutritionPlan } from '../../nutrition/entity/nutrition-plan.entity';
import { MealRecord } from '../../nutrition/entity/meal-record.entity';
import { HealthCheckup } from '../../health/entity/health-checkup.entity';
import { HealthReport } from '../../health/entity/health-report.entity';
import { DietaryRestriction } from '../../dietary-restriction/entity/dietary-restriction.entity';
import { CalorieCalculation } from '../../nutrition/entity/calorie-calculation.entity';
import { SupplementRecommendation } from '../../supplement-recommendation/entity/supplement-recommendation.entity';
import { NutritionGoal } from '../../nutrition/entity/nutrition-goal.entity';



@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  email: string;

  @Column()
  @IsNotEmpty({ message: '사용자 이름은 필수 입력 항목입니다.' })
  @MinLength(3, { message: '사용자 이름은 최소 3자 이상이어야 합니다.' }) 
  username: string;


  @Column()
  @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @Exclude()
  password: string;


  @Column({ nullable: true })
  @IsOptional()
  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  resetPasswordToken: string;



  @Column({ nullable: true })
  resetPasswordExpires: Date;


  @Column()
  @IsNotEmpty({ message: '이름은 필수 입력 항목입니다.' })
  firstName: string;

  @Column()
  @IsNotEmpty({ message: '성은 필수 입력 항목입니다.' })
  lastName: string;

  @Column()
  @IsDate({ message: '유효한 생년월일 형식이 아닙니다.' })
  dateOfBirth: Date;

  @Column()
  @IsEnum(['male', 'female', 'other'], { message: '유효한 성별을 선택해주세요.' })
  gender: string;

  @Column('float', { nullable: true })
  weight?: number;

  @Column('int', { nullable: true })
  age?: number;


  @CreateDateColumn()
  createdAt: Date;



  @UpdateDateColumn()
  updatedAt: Date;



  @OneToMany(() => HealthProfile, healthProfile => healthProfile.user)
  healthProfiles: HealthProfile[];

  @OneToOne(() => HealthProfile)
  @JoinColumn()
  currentHealthProfile: HealthProfile;

  @OneToMany(() => NutritionPlan, nutritionPlan => nutritionPlan.user)
  nutritionPlans: NutritionPlan[];

  @OneToMany(() => NutritionGoal, nutritionGoal => nutritionGoal.user)
  nutritionGoals: NutritionGoal[];
  
  @OneToMany(() => MealRecord, mealRecord => mealRecord.user)
  mealRecords: MealRecord[];


  @OneToMany(() => HealthCheckup, healthCheckup => healthCheckup.user)
  healthCheckups: HealthCheckup[];

  @OneToMany(() => HealthReport, healthReport => healthReport.user)
  healthReports: HealthReport[];

  @OneToMany(() => DietaryRestriction, dietaryRestriction => dietaryRestriction.user)
  dietaryRestrictions: DietaryRestriction[];

  @OneToMany(() => CalorieCalculation, calorieCalculation => calorieCalculation.user)
  calorieCalculations: CalorieCalculation[];

  @OneToMany(() => SupplementRecommendation, supplementRecommendation => supplementRecommendation.user)
  supplementRecommendations: SupplementRecommendation[];


}