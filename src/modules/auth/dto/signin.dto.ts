// src/modules/auth/dto/signin.dto.ts

import { IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsString({ message: '이메일 또는 사용자 이름은 문자열이어야 합니다.' })
  emailOrUsername: string;

  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  password: string;
}