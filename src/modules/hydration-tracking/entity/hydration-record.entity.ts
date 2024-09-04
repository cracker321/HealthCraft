// src/modules/hydration-tracking/entity/hydration-record.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity()
export class HydrationRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.hydrationRecords)
  user: User;

  @Column('float')
  amount: number;

  @CreateDateColumn()
  timestamp: Date;
}