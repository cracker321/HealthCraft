// src/modules/exercise-recommendation/entity/exercise.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  intensityLevel: string; // 'low', 'medium', 'high'

  @Column('simple-array')
  targetMuscleGroups: string[];

  @Column('float')
  caloriesBurnedPerHour: number;

  @Column('simple-array')
  equipmentNeeded: string[];

  @Column('simple-array')
  suitableFor: string[]; // 예: ['weight_loss', 'muscle_gain', 'cardio']
}