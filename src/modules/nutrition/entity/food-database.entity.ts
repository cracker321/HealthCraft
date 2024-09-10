import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, IsOptional, IsArray } from 'class-validator';

@Entity()
export class FoodDatabase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 음식 기본 정보
  @Column()
  @IsNotEmpty({ message: '음식 이름은 필수입니다.' })
  name: string;

  @Column()
  @IsNotEmpty({ message: '음식 분류는 필수입니다.' })
  category: string;

  // 영양 정보 (100g 기준)
  @Column('float')
  @IsNumber({}, { message: '100g당 칼로리는 숫자여야 합니다.' })
  @Min(0, { message: '칼로리는 0 이상이어야 합니다.' })
  caloriesPer100g: number;

  @Column('float')
  @IsNumber({}, { message: '단백질 함량은 숫자여야 합니다.' })
  @Min(0, { message: '단백질 함량은 0 이상이어야 합니다.' })
  proteinPer100g: number;

  @Column('float')
  @IsNumber({}, { message: '탄수화물 함량은 숫자여야 합니다.' })
  @Min(0, { message: '탄수화물 함량은 0 이상이어야 합니다.' })
  carbsPer100g: number;

  @Column('float')
  @IsNumber({}, { message: '지방 함량은 숫자여야 합니다.' })
  @Min(0, { message: '지방 함량은 0 이상이어야 합니다.' })
  fatPer100g: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
