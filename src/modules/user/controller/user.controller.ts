import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 사용자 프로필 조회 엔드포인트
  @Get('profile/:id')
  async getProfile(@Param('userId') userId: string) {
    return this.userService.findOne(userId);
  }

  // 사용자 프로필 업데이트 엔드포인트
  @Put('profile/:userId')
  async updateProfile(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(userId, updateUserDto);
  }
  // 기초 건강 정보 입력 엔드포인트
  @Post('health-info/:userId')
  async addHealthInfo(@Param('userId') userId: string, @Body() healthInfoDto: any) {
    return this.userService.createHealthProfile(userId, healthInfoDto);
  }

  // 건강 목표 설정 엔드포인트
  @Post('health-goal/:userId')
  async setHealthGoal(@Param('userId') userId: string, @Body() healthGoalDto: any) {
    // 이 메서드는 UserService에 구현되어 있지 않으므로, 필요에 따라 구현해야 함.
    // return this.userService.setHealthGoal(userId, healthGoalDto);
    throw new Error('Not implemented');
  }
}