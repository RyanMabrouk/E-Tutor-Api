import { Module } from '@nestjs/common';
import { NotificationsSocketService } from './notifications-socket.service';
import { NotificationsSocketGateway } from './notifications-socket.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [NotificationsSocketGateway, NotificationsSocketService],
  exports: [NotificationsSocketGateway],
})
export class NotificationsSocketModule {}
