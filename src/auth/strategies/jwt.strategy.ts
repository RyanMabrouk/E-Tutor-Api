import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { OrNeverType } from '../../utils/types/or-never.type';
import { AllConfigType } from 'src/config/config.type';
import { JwtPayloadType } from './types/jwt-payload.type';
import { AccessTokenName } from '../constants/token-names';
import { FastifyRequest } from 'fastify';
import { CustomSocket } from 'src/utils/types/CustomSocket.type';
import * as cookie from 'cookie';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService<AllConfigType>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: FastifyRequest | CustomSocket) => {
          let cookies: Record<string, string>;
          if (request instanceof CustomSocket) {
            cookies = cookie.parse(
              (request as CustomSocket).handshake.headers.cookie || '',
            );
          } else {
            cookies = cookie.parse(
              (request as FastifyRequest).headers.cookie || '',
            );
          }
          return cookies[AccessTokenName] ?? null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.secret', { infer: true }),
    });
  }

  // Why we don't check if the user exists in the database:
  // https://github.com/brocoders/nestjs-boilerplate/blob/main/docs/auth.md#about-jwt-strategy
  public validate(payload: JwtPayloadType): OrNeverType<JwtPayloadType> {
    if (!payload.id) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
