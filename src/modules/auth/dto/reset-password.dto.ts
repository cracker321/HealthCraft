// src/modules/auth/dto/reset-password.dto.ts

import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString({ message: '새 비밀번호는 문자열이어야 합니다.' })
  @MinLength(8, { message: '새 비밀번호는 최소 8자 이상이어야 합니다.' })
  newPassword: string;

  @IsString({ message: '토큰은 문자열이어야 합니다.' })
  token: string;
}