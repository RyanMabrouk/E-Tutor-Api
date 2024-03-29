import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import databaseConfig from 'src/database/config/database.config';
import { DatabaseConfig } from 'src/database/config/database-config.type';
import { UsersModule } from 'src/routes/users/users.module';
import { RelationalChatPersistenceModule } from './infastructure/persistence/relational/relational-persistence.module';
import { ValidateMembers } from 'src/utils/validation/vlalidate-members';
const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? class DocumentChatPersistenceModule {}
  : RelationalChatPersistenceModule;
@Module({
  imports: [infrastructurePersistenceModule, UsersModule],
  controllers: [ChatController],
  providers: [ChatService, ValidateMembers],
  exports: [ChatService, infrastructurePersistenceModule],
})
export class ChatModule {}
