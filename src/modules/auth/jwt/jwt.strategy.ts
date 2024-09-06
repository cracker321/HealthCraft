import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // JWT 토큰을 요청의 Authorization 헤더에서 추출
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,  // 만료된 토큰은 허용되지 않음
      // 환경 변수에서 JWT 시크릿 키 가져오기
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // JWT 페이로드를 검증하는 메서드
  async validate(payload: any) {
    // JWT의 페이로드에서 userId와 username을 추출하여 반환
    return { userId: payload.sub, username: payload.username };
  }
}
