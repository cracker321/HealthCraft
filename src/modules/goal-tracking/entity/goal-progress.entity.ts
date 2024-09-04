// src/modules/goal-tracking/entity/goal-progress.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { HealthGoal } from './health-goal.entity';

@Entity()
export class GoalProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => HealthGoal, goal => goal.progresses)
  goal: HealthGoal;

  @Column('float')
  currentValue: number;

  @CreateDateColumn()
  recordDate: Date;
}