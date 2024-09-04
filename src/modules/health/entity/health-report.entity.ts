
// HealthReport 인터페이스 정의
interface IHealthReport {
  id: string;
  user: User;
  latestCheckup: HealthCheckup;
  reportDate: Date;
  overallHealthStatus: string;
  healthMetrics: {
    bmi: number;
    bloodPressureStatus: string;
    cholesterolStatus: string;
    bloodSugarStatus: string;
  };
  improvements: string[];
  risks: string[];
  recommendations: {
    diet: string[];
    exercise: string[];
    lifestyle: string[];
  };
  additionalNotes?: string;
  createdAt: Date;
}

// HealthReport 엔티티:
// 사용자의 종합 건강 상태 보고서 저장
// 전반적 건강 상태, 개선점, 권장 사항 등 포함
// 다른 엔티티들의 데이터를 종합하여 생성
// 연관 관계:
// User와 N:1 관계 (여러 보고서가 한 사용자에 속함)
// HealthCheckup, NutritionPlan, ExerciseRecord 등과 관련됨
// src/modules/health/entity/health-report.entity.ts
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

  @Column('simple-array')
  improvements: string[];

  @Column('simple-array')
  risks: string[];

  @Column('simple-json')
  recommendations: {
    diet: string[];
    exercise: string[];
    lifestyle: string[];
  };

  @Column('text', { nullable: true })
  additionalNotes?: string;

  @CreateDateColumn()
  createdAt: Date;
}