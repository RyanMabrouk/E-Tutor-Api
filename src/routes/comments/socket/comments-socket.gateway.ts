import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Comment } from '../domain/comments';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from 'src/shared/guards/socket.guard';

@UseGuards(WsJwtGuard)
@WebSocketGateway({
  namespace: 'CommentSoket',
  cors: {
    origin: '*',
  },
})
export class CommentSocketGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('healthcheck')
  healthcheck() {
    return 'Ok';
  }

  emitCreate(payload: Comment): void {
    const lectureId = payload.lecture.id;
    this.server.emit(`post-${lectureId}`, payload);
  }

  emitUpdate(payload: Comment): void {
    const lectureId = payload.lecture.id;
    this.server.emit(`patch-${lectureId}`, payload);
  }
}
