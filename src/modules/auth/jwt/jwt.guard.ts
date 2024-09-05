// src/modules/auth/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// JWT 인증을 위한 가드
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}