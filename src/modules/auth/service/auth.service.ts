// src/modules/auth/service/auth.service.ts

import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../user/entity/user.entity';
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

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const { email, username, password } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ ...signUpDto, password: hashedPassword });
    return this.userRepository.save(user);
  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const { usernameOrEmail, password } = signInDto;
    const user = await this.userRepository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username: user.username, sub: user.id };
      return {
        accessToken: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException('Please check your login credentials');
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const resetToken = Math.random().toString(36).slice(-8);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await this.userRepository.save(user);
    // 여기서 이메일로 재설정 토큰을 보내야 함
  }

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
    user.password = await bcrypt.hash(resetPasswordDto.password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userRepository.save(user);
  }

  async findId(findIdDto: FindIdDto): Promise<string> {
    const { email } = findIdDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.username;
  }
}