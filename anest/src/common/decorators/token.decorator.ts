import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { response } from 'express';

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const response = ctx.switchToHttp().getResponse();
    return response.locals.jwt;
  },
);

//@Token() toekn
