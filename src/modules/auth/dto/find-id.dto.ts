// src/modules/auth/dto/find-id.dto.ts
import { IsEmail } from 'class-validator';

export class FindIdDto {
  // 이메일 유효성 검사
  @IsEmail()
  email: string;
}