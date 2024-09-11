// DietaryRestriction 엔티티:

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsEnum, IsDate, IsOptional } from 'class-validator';
import { User } from '../../user/entity/user.entity';


@Entity()
export class DietaryRestriction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // User 와의 다대일 관계
  @ManyToOne(() => User, user => user.dietaryRestrictions)
  user: User;

  // 식이 제한 정보
  @Column()
  @IsNotEmpty({ message: '제한 유형은 필수입니다.' })
  @IsEnum(['vegetarian', 'vegan', 'gluten-free', 'lactose-free', 'nut-free', 'low-carb', 'low-fat', 'low-sodium', 'other'], 
    { message: '유효한 제한 유형을 선택해주세요.' })
  restrictionType: string;

  @Column()
  type: string; // 예: 'vegetarian', 'vegan', 'gluten-free', 'lactose-free', 'nut-free' 등

  @Column()
  name: string; // 제한 사항의 이름

  @Column({ nullable: true })
  description: string; // 제한 사항에 대한 추가 설명

  @Column('text')
  @IsNotEmpty({ message: '제한 이유는 필수입니다.' })
  reason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;



 
}



