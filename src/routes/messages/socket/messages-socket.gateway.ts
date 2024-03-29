import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from 'src/routes/messages/domain/message';

@WebSocketGateway({
  namespace: 'MessagesSoket',
  cors: {
    origin: '*',
  },
})
export class MessagesSocketGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('healthcheck')
  healthcheck() {
    return 'Ok';
  }

  emitCreate(payload: Message): void {
    const chatId = payload.chat.id;
    this.server.emit(`post-${chatId}`, payload);
  }

  emitUpdate(payload: Message): void {
    const chatId = payload.chat.id;
    this.server.emit(`patch-${chatId}`, payload);
  }

  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('🚀 ~ MessagesSocketGateway ~ client:', client);
    console.log('🚀 ~ MessagesSocketGateway ~ name:', name);
    // join a room
    // TODO: implement Auth
  }

  @SubscribeMessage('typing')
  typing() {
    // typing a message
  }
}
