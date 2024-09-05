// src/modules/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // JWT 토큰을 헤더에서 추출
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 환경 변수에서 JWT 시크릿 키 가져오기
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // JWT 페이로드 검증
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}