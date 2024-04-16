import { Module } from '@nestjs/common';
import { RelationalCategoryPersistenceModule } from './infastructure/persistence/relational/relational-persistence.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
const infrastructurePersistenceModule = RelationalCategoryPersistenceModule;
@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService, infrastructurePersistenceModule],
})
export class CategoryModule {}
