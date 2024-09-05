// src/modules/user/user.controller.ts

import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 사용자 프로필 조회 엔드포인트
  @Get('profile/:id')
  async getProfile(@Param('id') id: string) {
    return this.userService.getProfile(id);
  }

  // 사용자 프로필 업데이트 엔드포인트
  @Put('profile/:id')
  async updateProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(id, updateUserDto);
  }

  // 기초 건강 정보 입력 엔드포인트
  @Post('health-info/:id')
  async addHealthInfo(@Param('id') id: string, @Body() healthInfoDto: any) {
    return this.userService.addHealthInfo(id, healthInfoDto);
  }

  // 건강 목표 설정 엔드포인트
  @Post('health-goal/:id')
  async setHealthGoal(@Param('id') id: string, @Body() healthGoalDto: any) {
    return this.userService.setHealthGoal(id, healthGoalDto);
  }
}