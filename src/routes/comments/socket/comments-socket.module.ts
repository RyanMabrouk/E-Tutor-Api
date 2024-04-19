import { Module } from '@nestjs/common';
import { CommentSocketGateway } from './comments-socket.gateway';
import { CommentSocketService } from './comments-socket.service';

@Module({
  providers: [CommentSocketGateway, CommentSocketService],
  exports: [CommentSocketGateway],
})
export class CommentsSocketModule {}
