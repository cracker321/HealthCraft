// src/modules/goal-tracking/entity/health-goal.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { GoalProgress } from './goal-progress.entity';

@Entity()
export class HealthGoal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.healthGoals)
  user: User;

  @Column()
  goalType: string; // 예: 'weight_loss', 'muscle_gain', 'improve_cardio'

  @Column('float')
  targetValue: number;

  @Column()
  unit: string; // 예: 'kg', 'minutes'

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @OneToMany(() => GoalProgress, progress => progress.goal)
  progresses: GoalProgress[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}