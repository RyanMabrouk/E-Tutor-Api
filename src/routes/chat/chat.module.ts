import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import databaseConfig from 'src/database/config/database.config';
import { DatabaseConfig } from 'src/database/config/database-config.type';
import { ValidateData } from 'src/utils/validation/vlalidate-data';
import { ProjectsModule } from 'src/routes/projects/projects.module';
import { UsersModule } from 'src/routes/users/users.module';
import { RelationalChatPersistenceModule } from './infastructure/persistence/relational/relational-persistence.module';
const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? class DocumentChatPersistenceModule {}
  : RelationalChatPersistenceModule;
@Module({
  imports: [infrastructurePersistenceModule, ProjectsModule, UsersModule],
  controllers: [ChatController],
  providers: [ChatService, ValidateData],
  exports: [ChatService, infrastructurePersistenceModule],
})
export class ChatModule {}
