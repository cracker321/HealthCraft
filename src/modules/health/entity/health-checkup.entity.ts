// HealthCheckup 엔티티:


// 정기 건강 검진 결과 저장
// 각종 건강 지표(혈압, 콜레스테롤, 혈당 등) 포함
// 건강 상태 모니터링 및 영양 계획 조정에 활용
// 연관 관계:

// User와 N:1 관계 (여러 검진 기록이 한 사용자에 속함)

// HealthCheckup 엔티티:
// 정기 건강 검진 결과 저장
// 각종 건강 지표(혈압, 콜레스테롤, 혈당 등) 포함
// 건강 상태 모니터링 및 영양 계획 조정에 활용
// 연관 관계:
// User와 N:1 관계 (여러 검진 기록이 한 사용자에 속함)

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, Max, IsDate, IsOptional } from 'class-validator';
import { User } from '../../user/entity/user.entity';

@Entity()
export class HealthCheckup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 사용자와의 다대일 관계
  @ManyToOne(() => User, user => user.healthCheckups)
  user: User;

  @Column('float')
  height: number; // 키 (cm)

  @Column()
  @IsNotEmpty({ message: '검진 날짜는 필수입니다.' })
  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  checkupDate: Date;

  @Column('float')
  @IsNumber({}, { message: '체중은 숫자여야 합니다.' })
  @Min(0, { message: '체중은 0kg 이상이어야 합니다.' })
  @Max(500, { message: '체중은 500kg 이하여야 합니다.' })
  weight: number; // 단위: kg

  @Column('float')
  @IsNumber({}, { message: '총 콜레스테롤은 숫자여야 합니다.' })
  @Min(0, { message: '총 콜레스테롤은 0 이상이어야 합니다.' })
  totalCholesterol: number; // 단위: mg/dL

  @Column('float')
  cholesterol: number; // 총 콜레스테롤

  @Column('float')
  @IsNumber({}, { message: '공복혈당은 숫자여야 합니다.' })
  @Min(0, { message: '공복혈당은 0 이상이어야 합니다.' })
  fastingBloodSugar: number; // 단위: mg/dL

  @CreateDateColumn()
  createdAt: Date;


  
}