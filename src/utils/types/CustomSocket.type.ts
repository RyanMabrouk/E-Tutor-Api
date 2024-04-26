import { Socket } from 'socket.io';
import { JwtPayloadType } from 'src/auth/strategies/types/jwt-payload.type';

export class CustomSocket extends Socket {
  user?: JwtPayloadType;
}
