// SupplementRecommendation 엔티티:


// 사용자별 맞춤 영양제 추천 정보 저장
// 추천 영양제 이름, 용량, 복용 시기 등 포함
// 예상 효과 및 주의사항 정보 저장
// 연관 관계:

// User와 N:1 관계 (여러 추천이 한 사용자에 속함)
// NutrientInfo와 M:N 관계 (하나의 추천은 여러 영양소와 관련될 수 있음)

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';
import { User } from '../../user/entity/user.entity';
import { NutrientInfo } from '../../nutrient-info/entity/nutrient-info.entity';

@Entity()
export class SupplementRecommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 사용자와의 다대일 관계
  @ManyToOne(() => User, user => user.supplementRecommendations)
  user: User;

  // 영양제 기본 정보
  @Column()
  @IsNotEmpty({ message: '영양제 이름은 필수입니다.' })
  supplementName: string;

  @Column()
  targetNutrient: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}