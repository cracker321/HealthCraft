// src/modules/auth/auth.controller.ts

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FindIdDto } from './dto/find-id.dto';

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

  // 비밀번호 찾기 엔드포인트
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto);
    return { message: '비밀번호 재설정 이메일을 전송했습니다.' };
  }

  // 비밀번호 재설정 엔드포인트
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return { message: '비밀번호가 성공적으로 재설정되었습니다.' };
  }

  // 아이디 찾기 엔드포인트
  @Post('find-id')
  @HttpCode(HttpStatus.OK)
  async findId(@Body() findIdDto: FindIdDto) {
    const username = await this.authService.findId(findIdDto);
    return { username };
  }
}