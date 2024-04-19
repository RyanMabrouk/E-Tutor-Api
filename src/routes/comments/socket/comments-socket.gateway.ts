import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Comment } from '../domain/comments';

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

  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('🚀 ~ CommentSocketGateway ~ client:', client);
    console.log('🚀 ~ CommentSocketGateway ~ name:', name);
    // join a room
    // TODO: implement Auth
  }

  @SubscribeMessage('typing')
  typing() {
    // typing a Comment
  }
}
