import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { SignUpDto } from '../dto/signup.dto';
import { SignInDto } from '../dto/signin.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { FindIdDto } from '../dto/find-id.dto';
import { hashPassword, comparePassword } from '../../../common/utils/password.util';

// 인증 관련 비즈니스 로직 처리
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  // 회원가입 메소드
  async signUp(signUpDto: SignUpDto): Promise<User> {
    const { email, username, password } = signUpDto;
    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password);
    // 새 사용자 생성
    const user = this.userRepository.create({ ...signUpDto, password: hashedPassword });
    // 사용자 저장 및 반환
    return this.userRepository.save(user);
  }

  // 로그인 메소드
  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const { emailOrUsername, password } = signInDto;
    // 이메일 또는 사용자 이름으로 사용자 찾기
    const user = await this.userRepository.findOne({
      where: [{ username: emailOrUsername }, { email: emailOrUsername }]
    });

    // 사용자가 존재하고 비밀번호가 일치하는 경우
    if (user && (await comparePassword(password, user.password))) {
      const payload = { username: user.username, sub: user.id };
      // JWT 토큰 생성 및 반환
      return {
        accessToken: this.jwtService.sign(payload),
      };
    }
    // 인증 실패 시 예외 발생
    throw new UnauthorizedException('로그인 정보를 확인하세요.');
  }

  // 로그아웃 메소드
  async logout(userId: string): Promise<void> {
    // TODO: 로그아웃 로직 구현 (예: 토큰 무효화)
  }

  // 비밀번호 찾기 메소드
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto;
    // 이메일로 사용자 찾기
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('해당 사용자가 존재하지 않습니다.');
    }
    // 비밀번호 재설정 토큰 생성
    const resetToken = Math.random().toString(36).slice(-8);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await this.userRepository.save(user);
    // TODO: 이메일로 재설정 토큰 전송
  }

  // 비밀번호 재설정 메소드
  async resetPassword(token: string, resetPasswordDto: ResetPasswordDto): Promise<void> {
    // 유효한 토큰을 가진 사용자 찾기
    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: MoreThan(new Date())
      }
    });
    if (!user) {
      throw new NotFoundException('유효하지 않거나 만료된 비밀번호 재설정 토큰입니다.');
    }
    // 새 비밀번호 해싱 및 저장
    user.password = await hashPassword(resetPasswordDto.newPassword);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userRepository.save(user);
  }

  // 아이디 찾기 메소드
  async findId(findIdDto: FindIdDto): Promise<string> {
    const { email } = findIdDto;
    // 이메일로 사용자 찾기
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('해당 사용자가 존재하지 않습니다.');
    }
    // 사용자 이름 반환
    return user.username;
  }
}