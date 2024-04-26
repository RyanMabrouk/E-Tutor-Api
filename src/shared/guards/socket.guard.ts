import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenName } from 'src/auth/constants/token-names';
import { CustomSocket } from 'src/utils/types/CustomSocket.type';
import * as cookie from 'cookie';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext) {
    const client: CustomSocket = context.switchToWs().getClient();
    try {
      const cookies = cookie.parse(client.handshake.headers.cookie || '');
      const token = cookies[AccessTokenName];
      const payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
      });
      client.user = payload;
      return true;
    } catch (e) {
      client.disconnect();
      return false;
    }
  }
}
