import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookies = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CookiesType => {
    const req = ctx.switchToHttp().getRequest();
    return req.cookies;
  },
);

type CookiesType = {
  accessToken: string;
  refreshToken: string;
};
