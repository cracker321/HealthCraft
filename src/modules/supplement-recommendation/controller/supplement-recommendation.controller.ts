// src/modules/supplement/supplement.controller.ts

import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SupplementRecommendationService } from '../service/supplement-recommendation.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';

@Controller('supplement')
@UseGuards(JwtAuthGuard)
export class SupplementRecommendationController {
  constructor(private readonly supplementService: SupplementRecommendationService) {}

  
  // 영양제 추천 엔드포인트
  @Get('recommendation/:userId')
  async getSupplementRecommendation(@Param('userId') userId: string) {
    return this.supplementService.recommendSupplement(userId);
  }
}