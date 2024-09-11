import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { HealthCheckupService } from '../service/health-checkup.service';
import { HealthReportService } from '../service/health-report.service';
import { CreateHealthCheckupDto } from '../dto/create-health-checkup.dto';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { HealthService } from '../service/health.service';

@Controller('health')
@UseGuards(JwtAuthGuard)
export class HealthController {
  constructor(
    private readonly healthCheckupService: HealthCheckupService,
    private readonly healthReportService: HealthReportService,
    private readonly healthService: HealthService 
  ) {}

  @Post('checkup/:userId')
  async createCheckup(@Param('userId') userId: string, @Body() createHealthCheckupDto: CreateHealthCheckupDto) {
    return this.healthCheckupService.create(userId, createHealthCheckupDto);
  }

  @Get('checkup/latest/:userId')
  async getLatestCheckup(@Param('userId') userId: string) {
    return this.healthCheckupService.findLatestByUserId(userId);
  }

  // 건강 리포트 생성 엔드포인트
  @Get('report/:userId')
  async generateReport(@Param('userId') userId: string) {
    return this.healthReportService.generateReport(userId);
  }


  // 건강 검진 기록 엔드포인트
  @Post('checkup/:userId')
  async recordCheckup(@Param('userId') userId: string, @Body() checkupData: any) {
    return this.healthService.recordCheckup(userId, checkupData); 
  }

}
