// src/modules/health/health.controller.ts

import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { HealthService } from '../service/health.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';

@Controller('health')
@UseGuards(JwtAuthGuard)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  // BMI 계산 엔드포인트
  @Get('bmi/:userId')
  async calculateBMI(@Param('userId') userId: string) {
    return this.healthService.calculateBMI(userId);
  }

  // BMR 계산 엔드포인트
  @Get('bmr/:userId')
  async calculateBMR(@Param('userId') userId: string) {
    return this.healthService.calculateBMR(userId);
  }

  // 건강 체크업 기록 엔드포인트
  @Post('checkup/:userId')
  async recordCheckup(@Param('userId') userId: string, @Body() checkupData: any) {
    return this.healthService.recordCheckup(userId, checkupData);
  }

  // 건강 리포트 생성 엔드포인트
  @Get('report/:userId')
  async generateHealthReport(@Param('userId') userId: string) {
    return this.healthService.generateHealthReport(userId);
  }
}