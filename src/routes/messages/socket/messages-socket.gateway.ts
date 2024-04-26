import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Message } from 'src/routes/messages/domain/message';
import { WsJwtGuard } from 'src/shared/guards/socket.guard';

@UseGuards(WsJwtGuard)
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

  emitIsTyping(payload: Message): void {
    const chatId = payload.chat.id;
    this.server.emit(`patch-${chatId}`, {
      user: payload.sender,
      isTyping: true,
    });
  }
}
