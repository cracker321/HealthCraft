// src/modules/health/health.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthProfileService } from './service/health-profile.service';
import { HealthCheckupService } from './service/health-checkup.service';
import { HealthReportService } from './service/health-report.service';
import { HealthController } from './controller/health.controller';
import { HealthProfile } from './entity/health-profile.entity';
import { HealthCheckup } from './entity/health-checkup.entity';
import { HealthReport } from './entity/health-report.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HealthProfile, HealthCheckup, HealthReport]),
    UserModule,
  ],
  providers: [HealthProfileService, HealthCheckupService, HealthReportService],
  controllers: [HealthController],
  exports: [HealthProfileService, HealthCheckupService, HealthReportService],
})
export class HealthModule {}