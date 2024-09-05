// src/modules/supplement/supplement.controller.ts

import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SupplementService } from './supplement.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('supplement')
@UseGuards(JwtAuthGuard)
export class SupplementRecommendationController {
  constructor(private readonly supplementService: SupplementService) {}

  // 영양제 추천 엔드포인트
  @Get('recommendation/:userId')
  async getSupplementRecommendation(@Param('userId') userId: string) {
    return this.supplementService.recommendSupplement(userId);
  }

  // 영양제 복용 스케줄 생성 엔드포인트
  @Post('schedule/:userId')
  async createSupplementSchedule(@Param('userId') userId: string, @Body() scheduleData: any) {
    return this.supplementService.createSupplementSchedule(userId, scheduleData);
  }
}