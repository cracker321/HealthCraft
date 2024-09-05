// src/modules/auth/dto/signup.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  // 이메일 유효성 검사
  @IsEmail()
  email: string;

  // 사용자 이름, 최소 4자 이상
  @IsString()
  @MinLength(4)
  username: string;

  // 비밀번호, 최소 6자 이상
  @IsString()
  @MinLength(6)
  password: string;
}