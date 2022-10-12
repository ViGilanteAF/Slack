import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  //AuthGuard 안에 canActivate 가 선언되어있어서 implements 를 하지 않음!
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const can = await super.canActivate(context);
    if (can) {
      const request = context.switchToHttp().getRequest();
      console.log('login For Cookie');
      await super.logIn(request);
    }
    return true;
  }
}
