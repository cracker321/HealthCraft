// src/modules/auth/dto/find-id.dto.ts

import { IsEmail } from 'class-validator';

export class FindIdDto {
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  email: string;
}