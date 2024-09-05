// src/common/guards/jwt-auth.guard.ts

import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // 부모 클래스의 canActivate 메서드를 호출합니다.
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // 인증에 실패하면 에러를 던집니다.
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}