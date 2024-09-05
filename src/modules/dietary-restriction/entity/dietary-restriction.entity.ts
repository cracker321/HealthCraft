import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entity/user.entity'; // User와의 연관관계 설정

@Entity()
export class DietaryRestriction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.dietaryRestrictions)
  user: User;

  @Column()
  type: string; // 예: 'vegetarian', 'vegan', 'gluten-free', 'lactose-free', 'nut-free' 등

  @Column()
  name: string; // 제한 사항의 이름

  @Column({ nullable: true })
  description: string; // 제한 사항에 대한 추가 설명

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
