// src/modules/auth/controller/auth.controller.ts

import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Param } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignUpDto } from '../dto/signup.dto';
import { SignInDto } from '../dto/signin.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { FindIdDto } from '../dto/find-id.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { User } from '../../../common/decorators/user.decorator';

// 인증 관련 엔드포인트를 처리하는 컨트롤러
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 회원가입 엔드포인트
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    // AuthService의 signUp 메소드를 호출하여 사용자 등록
    return this.authService.signUp(signUpDto);
  }

  // 로그인 엔드포인트
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto) {
    // AuthService의 signIn 메소드를 호출하여 사용자 인증
    return this.authService.signIn(signInDto);
  }

  // 로그아웃 엔드포인트 (JWT 인증)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@User() user) {
    // AuthService의 logout 메소드를 호출하여 로그아웃 처리
    return this.authService.logout(user.id);
  }

  // 비밀번호 찾기 엔드포인트
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    // AuthService의 forgotPassword 메소드를 호출하여 비밀번호 재설정 토큰 생성
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  // 비밀번호 재설정 엔드포인트
  @Post('reset-password/:token')
  async resetPassword(@Param('token') token: string, @Body() resetPasswordDto: ResetPasswordDto) {
    // AuthService의 resetPassword 메소드를 호출하여 비밀번호 재설정
    return this.authService.resetPassword(token, resetPasswordDto);
  }

  // 아이디 찾기 엔드포인트
  @Post('find-id')
  async findId(@Body() findIdDto: FindIdDto) {
    // AuthService의 findId 메소드를 호출하여 사용자 아이디 찾기
    return this.authService.findId(findIdDto);
  }
}