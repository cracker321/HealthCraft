// src/modules/auth/dto/forgot-password.dto.ts
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  // 이메일 유효성 검사
  @IsEmail()
  email: string;
}
