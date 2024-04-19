import { Module } from '@nestjs/common';
import databaseConfig from 'src/database/config/database.config';
import { DatabaseConfig } from 'src/database/config/database-config.type';
import { RelationalCommentPersistenceModule } from './infastructure/persistence/relational/relational-persistence.module';
import { CommentsSocketModule } from './socket/comments-socket.module';
import { CommentController } from './comments.controller';
import { CommentService } from './comments.service';
import { LectureModule } from '../lectures/lecture.module';
import { UsersModule } from '../users/users.module';
const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? class DocumentCommentPersistenceModule {}
  : RelationalCommentPersistenceModule;
@Module({
  imports: [
    infrastructurePersistenceModule,
    CommentModule,
    CommentsSocketModule,
    LectureModule,
    UsersModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService, infrastructurePersistenceModule],
})
export class CommentModule {}
