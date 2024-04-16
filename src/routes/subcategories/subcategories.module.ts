import { Module } from '@nestjs/common';
import { RelationalSubcategoryPersistenceModule } from './infastructure/persistence/relational/relational-persistence.module';
import { SubcategoryController } from './subcategories.controller';
import { SubcategoryService } from './subcategories.service';
import { CategoryModule } from '../categories/categories.module';
const infrastructurePersistenceModule = RelationalSubcategoryPersistenceModule;
@Module({
  imports: [infrastructurePersistenceModule, CategoryModule],
  controllers: [SubcategoryController],
  providers: [SubcategoryService],
  exports: [SubcategoryService, infrastructurePersistenceModule],
})
export class SubcategoryModule {}
