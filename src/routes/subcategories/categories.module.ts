import { Module } from '@nestjs/common';
import { RelationalMessagePersistenceModule } from './infastructure/persistence/relational/relational-persistence.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
const infrastructurePersistenceModule = RelationalMessagePersistenceModule;
@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService, infrastructurePersistenceModule],
})
export class LanguageModule {}
