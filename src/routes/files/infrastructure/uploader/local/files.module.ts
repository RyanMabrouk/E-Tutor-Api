import { Module } from '@nestjs/common';
import { FilesLocalController } from './files.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FilesLocalService } from './files.service';
import databaseConfig from 'src/database/config/database.config';
import { DatabaseConfig } from 'src/database/config/database-config.type';
import { RelationalFilePersistenceModule } from '../../persistence/relational/relational-persistence.module';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? class DocumentFilePersistenceModule {}
  : RelationalFilePersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [FilesLocalController],
  providers: [ConfigModule, ConfigService, FilesLocalService],
  exports: [FilesLocalService],
})
export class FilesLocalModule {}
