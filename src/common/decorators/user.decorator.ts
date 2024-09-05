// src/common/decorators/user.decorator.ts

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// User 데코레이터 정의
// 이 데코레이터는 요청에서 사용자 정보를 추출하는 데 사용됩니다.
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // 실행 컨텍스트에서 요청 객체를 가져옵니다.
    const request = ctx.switchToHttp().getRequest();
    // 요청 객체에서 user 속성을 반환합니다.
    return request.user;
  },
);