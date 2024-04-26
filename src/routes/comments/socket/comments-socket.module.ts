import { Module } from '@nestjs/common';
import { CommentSocketGateway } from './comments-socket.gateway';
import { CommentSocketService } from './comments-socket.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [CommentSocketGateway, CommentSocketService],
  exports: [CommentSocketGateway],
})
export class CommentsSocketModule {}
