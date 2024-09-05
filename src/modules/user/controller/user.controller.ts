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
  async getProfile(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  // 사용자 프로필 업데이트 엔드포인트
  @Put('profile/:id')
  async updateProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  // 기초 건강 정보 입력 엔드포인트
  @Post('health-info/:id')
  async addHealthInfo(@Param('id') id: string, @Body() healthInfoDto: any) {
    return this.userService.createHealthProfile(id, healthInfoDto);
  }

  // 건강 목표 설정 엔드포인트
  @Post('health-goal/:id')
  async setHealthGoal(@Param('id') id: string, @Body() healthGoalDto: any) {
    // 이 메서드는 UserService에 구현되어 있지 않으므로, 필요에 따라 구현해야 합니다.
    // return this.userService.setHealthGoal(id, healthGoalDto);
    throw new Error('Not implemented');
  }
}