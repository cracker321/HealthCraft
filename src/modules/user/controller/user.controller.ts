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

}