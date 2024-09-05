// src/modules/exercise/controller/exercise-tracking.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ExerciseTrackingService } from '../service/exercise-tracking.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { CreateExerciseRecordDto } from '../dto/create-exercise-record.dto';

@Controller('exercise')
@UseGuards(JwtAuthGuard)
export class ExerciseTrackingController {
  constructor(private readonly exerciseService: ExerciseTrackingService) {}

  // 운동량 기록 엔드포인트
  @Post('record/:userId')
  async recordExercise(@Param('userId') userId: string, @Body() exerciseData: CreateExerciseRecordDto) {
    return this.exerciseService.addExerciseRecord(userId, exerciseData);
  }

  // 운동 통계 조회 엔드포인트
  @Get('stats/:userId')
  async getExerciseStats(@Param('userId') userId: string) {
    return this.exerciseService.getWeeklyExerciseStats(userId);
  }
}