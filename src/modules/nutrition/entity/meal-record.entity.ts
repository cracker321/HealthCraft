// MealRecord 엔티티:

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { IsNotEmpty, IsDate, IsEnum, IsNumber, Min, IsOptional } from 'class-validator';
import { User } from '../../user/entity/user.entity';
import { FoodDatabase } from './food-database.entity';
import { Recipe } from './recipe.entity';

@Entity()
export class MealRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.mealRecords)
  user: User;

  @Column()
  @IsNotEmpty({ message: '식사 시간은 필수입니다.' })
  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  eatenAt: Date;

  @ManyToMany(() => FoodDatabase)
  @JoinTable()
  foodItems: FoodDatabase[];

  @ManyToMany(() => Recipe)
  @JoinTable()
  recipes: Recipe[];

  @Column('simple-json')
  portions: { [foodId: string]: number };

  @Column('simple-json')
  recipeServings: { [recipeId: string]: number };

  @Column('float')
  @IsNumber({}, { message: '총 칼로리는 숫자여야 합니다.' })
  @Min(0, { message: '총 칼로리는 0 이상이어야 합니다.' })
  totalCalories: number;

  @Column('float')
  @IsNumber({}, { message: '총 단백질은 숫자여야 합니다.' })
  @Min(0, { message: '총 단백질은 0 이상이어야 합니다.' })
  totalProtein: number;

  @Column('float')
  @IsNumber({}, { message: '총 탄수화물은 숫자여야 합니다.' })
  @Min(0, { message: '총 탄수화물은 0 이상이어야 합니다.' })
  totalCarbs: number;

  @Column('float')
  @IsNumber({}, { message: '총 지방은 숫자여야 합니다.' })
  @Min(0, { message: '총 지방은 0 이상이어야 합니다.' })
  totalFat: number;

  @Column({ nullable: true })
  @IsOptional()
  photoUrl?: string;

  @CreateDateColumn()
  createdAt: Date;


}