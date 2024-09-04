// src/modules/meal-planner/entity/meal-plan.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity()
export class MealPlan {
  // 고유 식별자
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 식단 계획의 시작 날짜
  @Column()
  startDate: Date;

  // 식단 계획의 종료 날짜
  @Column()
  endDate: Date;

  // 식단 계획 (JSON 형식으로 저장)
  // 예: { "2023-05-01": [{ "breakfast": "recipe_id_1" }, { "lunch": "recipe_id_2" }, { "dinner": "recipe_id_3" }] }
  @Column('simple-json')
  meals: any[]; // 이 부분을 any[]로 변경

  // 사용자와의 다대일 관계
  @ManyToOne(() => User, user => user.mealPlans)
  user: User;

  // 생성 일시
  @CreateDateColumn()
  createdAt: Date;

  // 수정 일시
  @UpdateDateColumn()
  updatedAt: Date;

  // 식단 계획에 레시피 추가 메서드
  addMeal(date: string, mealType: string, recipeId: string) {
    if (!this.meals[date]) {
      this.meals[date] = [];
    }
    this.meals[date].push({ [mealType]: recipeId });
  }

  // 특정 날짜의 식단 조회 메서드
  getMealsForDate(date: string): { [mealType: string]: string }[] {
    return this.meals[date] || [];
  }

  // 식단 계획 요약 생성 메서드
  generateSummary(): string {
    let summary = `식단 계획 (${this.startDate.toLocaleDateString()} - ${this.endDate.toLocaleDateString()})\n\n`;
    
    Object.entries(this.meals).forEach(([date, meals]) => {
      summary += `${date}:\n`;
      meals.forEach(meal => {
        const [mealType, recipeId] = Object.entries(meal)[0];
        summary += `  ${mealType}: Recipe ID ${recipeId}\n`;
      });
      summary += '\n';
    });

    return summary;
  }
}