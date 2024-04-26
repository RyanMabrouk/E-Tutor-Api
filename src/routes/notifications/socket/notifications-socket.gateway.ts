import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Notification } from '../domain/notifications';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from 'src/shared/guards/socket.guard';

@UseGuards(WsJwtGuard)
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
}
