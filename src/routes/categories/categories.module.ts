import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { RelationalCategoryPersistenceModule } from './infastructure/persistence/relational/relational-persistence.module';
const infrastructurePersistenceModule = RelationalCategoryPersistenceModule;
@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService, infrastructurePersistenceModule],
})
export class CategoryModule {}
