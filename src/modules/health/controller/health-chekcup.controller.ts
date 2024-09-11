import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { HealthCheckupService } from '../service/health-checkup.service';
import { CreateHealthCheckupDto } from '../dto/create-health-checkup.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';

// 건강 검진 관련 엔드포인트를 처리하는 컨트롤러
@Controller('health-checkup')
@UseGuards(JwtAuthGuard)
export class HealthCheckupController {
  constructor(private readonly healthCheckupService: HealthCheckupService) {}

  // 건강 검진 기록 생성 엔드포인트
  @Post()
  async createCheckup(@User() user, @Body() createHealthCheckupDto: CreateHealthCheckupDto) {
    // HealthCheckupService의 create 메소드를 호출하여 건강 검진 기록 생성
    return this.healthCheckupService.create(user.id, createHealthCheckupDto);
  }

  // 최근 건강 검진 조회 엔드포인트
  @Get('latest')
  async getLatestCheckup(@User() user) {
    // HealthCheckupService의 findLatestByUserId 메소드를 호출하여 최근 건강 검진 조회
    return this.healthCheckupService.findLatestByUserId(user.id);
  }

  // 건강 검진 리포트 생성 엔드포인트
  @Get('report')
  async generateReport(@User() user) {
    // HealthCheckupService의 generateReport 메소드를 호출하여 건강 체크업 리포트 생성
    return this.healthCheckupService.generateReport(user.id);
  }
}