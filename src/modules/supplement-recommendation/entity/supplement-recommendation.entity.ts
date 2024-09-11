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