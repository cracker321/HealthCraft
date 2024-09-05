// src/modules/auth/auth.controller.ts

import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignUpDto } from '../dto/signup.dto';
import { SignInDto } from '../dto/signin.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { FindIdDto } from '../dto/find-id.dto';
import { JwtAuthGuard } from '../jwt/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 회원가입 엔드포인트
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  // 로그인 엔드포인트
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  // 로그아웃 엔드포인트
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return { message: 'Logged out successfully' };
  }

  // 비밀번호 찾기 엔드포인트
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  // 비밀번호 재설정 엔드포인트
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  // 아이디 찾기 엔드포인트
  @Post('find-id')
  async findId(@Body() findIdDto: FindIdDto) {
    return this.authService.findId(findIdDto);
  }
}