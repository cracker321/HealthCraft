// src/modules/auth/dto/signin.dto.ts
import { IsString } from 'class-validator';

export class SignInDto {
  // 사용자 이름 또는 이메일
  @IsString()
  usernameOrEmail: string;

  // 비밀번호
  @IsString()
  password: string;
}