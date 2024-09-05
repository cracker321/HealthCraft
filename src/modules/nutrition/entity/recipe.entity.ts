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

  @Column('simple-array')
  @IsArray()
  @IsNotEmpty({ each: true, message: '각 조리 단계는 비어있지 않아야 합니다.' })
  instructions: string[];

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

  @Column('simple-array')
  @IsArray()
  @IsString({ each: true, message: '각 태그는 문자열이어야 합니다.' })
  tags: string[];

  @Column({ nullable: true })
  @IsString({ message: '사진 URL은 문자열이어야 합니다.' })
  photoUrl?: string;

  @Column('simple-array')
  dietaryRestrictions: string[];

  @Column('float', { default: 0 })
  @IsNumber({}, { message: '평점은 숫자여야 합니다.' })
  @Min(0, { message: '평점은 0 이상이어야 합니다.' })
  @Max(5, { message: '평점은 5 이하여야 합니다.' })
  rating: number;

  @Column()
  @IsString({ message: '계절은 문자열이어야 합니다.' })
  season: string;


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 영양 정보 계산 메서드
  calculateNutrition() {
    this.calories = 0;
    this.protein = 0;
    this.carbs = 0;
    this.fat = 0;

    this.ingredientAmounts.forEach(ia => {
      const ingredient = this.ingredients.find(i => i.id === ia.ingredientId);
      if (ingredient) {
        const factor = ia.amount / 100; // 영양 정보는 보통 100g 기준으로 저장됨
        this.calories += ingredient.calories * factor;
        this.protein += ingredient.protein * factor;
        this.carbs += ingredient.carbs * factor;
        this.fat += ingredient.fat * factor;
      }
    });

    // 1인분 기준으로 조정
    this.calories /= this.servings;
    this.protein /= this.servings;
    this.carbs /= this.servings;
    this.fat /= this.servings;
  }

  // 레시피 요약 생성 메서드
  generateSummary(): string {
    let summary = `레시피: ${this.name}\n\n`;
    summary += `설명: ${this.description}\n\n`;
    summary += `준비 시간: ${this.prepTime}분\n`;
    summary += `조리 시간: ${this.cookTime}분\n`;
    summary += `서빙 수: ${this.servings}\n\n`;
    summary += "재료:\n";
    this.ingredientAmounts.forEach(ia => {
      const ingredient = this.ingredients.find(i => i.id === ia.ingredientId);
      if (ingredient) {
        summary += `- ${ingredient.name}: ${ia.amount} ${ia.unit}\n`;
      }
    });
    summary += "\n조리 방법:\n";
    this.instructions.forEach((step, index) => {
      summary += `${index + 1}. ${step}\n`;
    });
    summary += "\n영양 정보 (1인분 기준):\n";
    summary += `칼로리: ${this.calories.toFixed(2)} kcal\n`;
    summary += `단백질: ${this.protein.toFixed(2)} g\n`;
    summary += `탄수화물: ${this.carbs.toFixed(2)} g\n`;
    summary += `지방: ${this.fat.toFixed(2)} g\n`;
    summary += `\n태그: ${this.tags.join(', ')}`;
    return summary;
  }

  // 특정 식이 제한에 맞는지 확인하는 메서드
  checkDietaryRestrictions(restrictions: string[]): boolean {
    return this.ingredients.every(ingredient => 
      !restrictions.some(restriction => 
        ingredient.dietaryRestrictions?.includes(restriction)
      )
    );
  }
}