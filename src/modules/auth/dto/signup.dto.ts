import { IsEmail, IsString, MinLength, IsEnum, IsDate } from 'class-validator';

export class SignUpDto {
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  email: string;

  @IsString({ message: '사용자 이름은 문자열이어야 합니다.' })
  @MinLength(3, { message: '사용자 이름은 최소 3자 이상이어야 합니다.' })
  username: string;

  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  password: string;

  @IsString({ message: '이름은 문자열이어야 합니다.' })
  firstName: string;

  @IsString({ message: '성은 문자열이어야 합니다.' })
  lastName: string;

  @IsDate({ message: '유효한 생년월일을 입력해주세요.' })
  dateOfBirth: Date;

  @IsEnum(['male', 'female', 'other'], { message: '유효한 성별을 선택해주세요.' })
  gender: string;
}