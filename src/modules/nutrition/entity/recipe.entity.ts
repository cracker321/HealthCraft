// src/modules/nutrition/entity/recipe.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, Max, IsArray, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Ingredient } from './ingredient.entity';
import { DietaryRestriction } from '../../dietary-restriction/entity/dietary-restriction.entity';

// 재료의 양을 나타내는 클래스
class IngredientAmount {
  @IsNotEmpty()
  ingredientId: string;

  @IsNumber({}, { message: '재료의 양은 숫자여야 합니다.' })
  @Min(0, { message: '재료의 양은 0 이상이어야 합니다.' })
  amount: number;

  @IsNotEmpty({ message: '단위를 입력해주세요.' })
  unit: string;
}

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty({ message: '레시피 이름은 필수입니다.' })
  name: string;

  @Column('text')
  @IsNotEmpty({ message: '레시피 설명은 필수입니다.' })
  description: string;

  @Column('int')
  @IsNumber({}, { message: '준비 시간은 숫자여야 합니다.' })
  @Min(0, { message: '준비 시간은 0분 이상이어야 합니다.' })
  prepTime: number; // 단위: 분

  @Column('int')
  @IsNumber({}, { message: '조리 시간은 숫자여야 합니다.' })
  @Min(0, { message: '조리 시간은 0분 이상이어야 합니다.' })
  cookTime: number; // 단위: 분

  @Column('int')
  @IsNumber({}, { message: '서빙 수는 숫자여야 합니다.' })
  @Min(1, { message: '서빙 수는 1 이상이어야 합니다.' })
  servings: number;

  @Column('simple-json')
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientAmount)
  ingredientAmounts: IngredientAmount[];

  @ManyToMany(() => Ingredient)
  @JoinTable()
  ingredients: Ingredient[];

  @Column('float')
  @IsNumber({}, { message: '칼로리는 숫자여야 합니다.' })
  @Min(0, { message: '칼로리는 0 이상이어야 합니다.' })
  calories: number;

  @Column('float')
  @IsNumber({}, { message: '단백질은 숫자여야 합니다.' })
  @Min(0, { message: '단백질은 0 이상이어야 합니다.' })
  protein: number;

  @Column('float')
  @IsNumber({}, { message: '탄수화물은 숫자여야 합니다.' })
  @Min(0, { message: '탄수화물은 0 이상이어야 합니다.' })
  carbs: number;

  @Column('float')
  @IsNumber({}, { message: '지방은 숫자여야 합니다.' })
  @Min(0, { message: '지방은 0 이상이어야 합니다.' })
  fat: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}