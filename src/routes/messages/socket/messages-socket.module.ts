import { Module } from '@nestjs/common';
import { MessagesSocketService } from './messages-socket.service';
import { MessagesSocketGateway } from './messages-socket.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [MessagesSocketGateway, MessagesSocketService],
  exports: [MessagesSocketGateway],
})
export class MessagesSocketModule {}
