// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/service/auth.service';
import { AuthController } from '../auth/controller/auth.controller';
import { JwtStrategy } from './jwt/jwt.strategy';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [
    // Passport 모듈 설정
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // JWT 모듈 설정
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    // User 엔티티를 위한 TypeORM 설정
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}