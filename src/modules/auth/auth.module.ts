import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { JwtStrategy } from './jwt/jwt.strategy';
import { User } from '../user/entity/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // Passport 모듈 설정: 기본 인증 전략으로 JWT 사용
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JWT 모듈 설정: 환경 변수를 사용해 동적으로 JWT 설정
    JwtModule.registerAsync({
      imports: [ConfigModule],  // ConfigModule에서 환경 변수를 가져옴
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),  // JWT_SECRET 환경 변수 사용
        signOptions: { expiresIn: '1h' },  // 토큰 만료 시간은 1시간
      }),
      inject: [ConfigService],
    }),

    // User 엔티티를 TypeORM에 등록
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, JwtStrategy],  // AuthService와 JwtStrategy를 제공
  controllers: [AuthController],  // AuthController를 포함
  exports: [JwtStrategy, PassportModule],  // 다른 모듈에서 사용할 수 있도록 JwtStrategy와 PassportModule을 내보냄
})
export class AuthModule {}
