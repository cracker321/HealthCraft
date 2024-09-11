

// HealthReport 엔티티:

// 연관 관계:
// User와 N:1 관계 (여러 보고서가 한 사용자에 속함)
// HealthCheckup, NutritionPlan, ExerciseRecord 등과 관련됨
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { HealthCheckup } from './health-checkup.entity';

@Entity()
export class HealthReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.healthReports)
  user: User;

  @OneToOne(() => HealthCheckup)
  @JoinColumn()
  latestCheckup: HealthCheckup;

  @CreateDateColumn()
  reportDate: Date;

  @Column('text')
  overallHealthStatus: string;

  @Column('simple-json')
  healthMetrics: {
    bmi: number;
    bloodPressureStatus: string;
    cholesterolStatus: string;
    bloodSugarStatus: string;
  };


  @CreateDateColumn()
  createdAt: Date;
}