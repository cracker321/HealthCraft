import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthProfileService } from './service/health-profile.service';
import { HealthCheckupService } from './service/health-checkup.service';
import { HealthReportService } from './service/health-report.service';
import { HealthController } from './controller/health.controller';
import { HealthProfile } from './entity/health-profile.entity';
import { HealthCheckup } from './entity/health-checkup.entity';
import { HealthReport } from './entity/health-report.entity';
import { UserModule } from '../user/user.module';
import { HealthService } from './service/health.service'; // HealthService 추가

@Module({
  imports: [
    // HealthProfile, HealthCheckup, HealthReport 엔티티를 TypeORM에 등록
    TypeOrmModule.forFeature([HealthProfile, HealthCheckup, HealthReport]),
    // 순환 종속성 방지를 위해 forwardRef 사용
    forwardRef(() => UserModule),
  ],
  providers: [
    HealthProfileService, 
    HealthCheckupService, 
    HealthReportService,
    HealthService
  ],
  controllers: [HealthController],
  exports: [
    HealthProfileService, 
    HealthCheckupService, 
    HealthReportService,
    HealthService 
  ],
})
export class HealthModule {}
