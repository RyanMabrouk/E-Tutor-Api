import { forwardRef, Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageController } from './Language.controller';
import databaseConfig from 'src/database/config/database.config';
import { DatabaseConfig } from 'src/database/config/database-config.type';
import { RelationalMessagePersistenceModule } from './infastructure/persistence/relational/relational-persistence.module';
import { ChatModule } from '../chat/chat.module';
export const infrastructurePersistenceModule = (
  databaseConfig() as DatabaseConfig
).isDocumentDatabase
  ? class DocumentMessagePersistenceModule {}
  : RelationalMessagePersistenceModule;
@Module({
  imports: [infrastructurePersistenceModule, forwardRef(() => ChatModule)],
  controllers: [LanguageController],
  providers: [LanguageService],
  exports: [LanguageService, infrastructurePersistenceModule],
})
export class LanguageModule {}
