// CalorieCalculation 엔티티:

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, IsDate } from 'class-validator';
import { User } from '../../user/entity/user.entity';

@Entity()
export class CalorieCalculation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 사용자와의 다대일 관계
  @ManyToOne(() => User, user => user.calorieCalculations)
  user: User;

  @Column()
  @IsNotEmpty({ message: '계산 날짜는 필수입니다.' })
  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  calculationDate: Date;

  // 음식 목록 및 영양 정보
  @Column('simple-json')
  @IsNotEmpty({ message: '음식 목록은 필수입니다.' })
  foodItems: { [foodName: string]: number }; // 음식 이름과 중량

  @Column('float')
  @IsNumber({}, { message: '총 칼로리는 숫자여야 합니다.' })
  @Min(0, { message: '총 칼로리는 0 이상이어야 합니다.' })
  totalCalories: number;

  @CreateDateColumn()
  createdAt: Date;

  // 칼로리 계산 메서드
  calculateCalories(foodDatabase: { [foodName: string]: { caloriesPer100g: number, nutritionPer100g: any } }): void {
    this.totalCalories = 0;

    for (const [foodName, grams] of Object.entries(this.foodItems)) {
      if (foodDatabase[foodName]) {
        const factor = grams / 100;
        this.totalCalories += foodDatabase[foodName].caloriesPer100g * factor;
      }
    }

  }
}