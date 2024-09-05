
// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entity/user.entity';
import { SignUpDto } from '../dto/signup.dto';
import { SignInDto } from '../dto/signin.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { FindIdDto } from '../dto/find-id.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  // 회원가입 메서드
  async signUp(signUpDto: SignUpDto): Promise<User> {
    const { email, username, password } = signUpDto;
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);
    // 새 사용자 생성
    const user = this.userRepository.create({ email, username, password: hashedPassword });
    return this.userRepository.save(user);
  }

  // 로그인 메서드
  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const { usernameOrEmail, password } = signInDto;
    // 사용자 이름 또는 이메일로 사용자 찾기
    const user = await this.userRepository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });

    // 비밀번호 확인
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username: user.username, sub: user.id };
      // JWT 토큰 생성 및 반환
      return {
        accessToken: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException('Please check your login credentials');
  }

  // 비밀번호 찾기 메서드
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // 비밀번호 재설정 토큰 생성
    const resetToken = Math.random().toString(36).slice(-8);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await this.userRepository.save(user);
    // 여기서 이메일로 재설정 토큰을 보내야 함
  }

  // 비밀번호 재설정 메서드
  async resetPassword(token: string, resetPasswordDto: ResetPasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: MoreThan(new Date())
      }
    });
    if (!user) {
      throw new NotFoundException('Invalid or expired password reset token');
    }
    // 새 비밀번호 해싱 및 저장
    user.password = await bcrypt.hash(resetPasswordDto.password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userRepository.save(user);
  }

  // 아이디 찾기 메서드
  async findId(findIdDto: FindIdDto): Promise<string> {
    const { email } = findIdDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.username;
  }
}