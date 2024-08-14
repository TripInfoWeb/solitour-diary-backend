// Injectable이 있으므로 프로바이더에 해당

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

// CanActivate 인터페이스 구현
@Injectable()
export class AuthGuard implements CanActivate {
  // CanActivate 인터페이스의 메서드
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // context에서 request 정보를 가져옴.
    const request = context.switchToHttp().getRequest();

    // 쿠키가 있으면 인증된 것
    if (request.cookies['access_token']) {
      return true;
    }

    return false;
  }
}
