// src/modules/auth/dto/reset-password.dto.ts
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  // 새 비밀번호, 최소 6자 이상
  @IsString()
  @MinLength(6)
  password: string;
}
