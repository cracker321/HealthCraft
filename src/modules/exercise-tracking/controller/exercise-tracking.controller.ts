// src/modules/exercise/exercise.controller.ts

import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ExerciseTrackingService } from '../service/exercise-tracking.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';

@Controller('exercise')
@UseGuards(JwtAuthGuard)
export class ExerciseTrackingController {
  constructor(private readonly exerciseService: ExerciseTrackingService) {}

  // 운동량 기록 엔드포인트
  @Post('record/:userId')
  async recordExercise(@Param('userId') userId: string, @Body() exerciseData: any) {
    return this.exerciseService.recordExercise(userId, exerciseData);
  }

  // 운동 통계 조회 엔드포인트
  @Get('stats/:userId')
  async getExerciseStats(@Param('userId') userId: string) {
    return this.exerciseService.getExerciseStats(userId);
  }
}