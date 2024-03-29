import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Notification } from '../domain/notifications';

@WebSocketGateway({
  namespace: 'NotificationsSoket',
  cors: {
    origin: '*',
  },
})
export class NotificationsSocketGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('healthcheck')
  healthcheck() {
    return 'Ok';
  }

  emitCreate(payload: Notification): void {
    for (const receiver of payload.receivers) {
      this.server.emit(`post-${receiver.id}`, payload);
    }
  }

  emitUpdate(payload: Notification): void {
    for (const receiver of payload.receivers) {
      this.server.emit(`patch-${receiver.id}`, payload);
    }
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
}
