import { Module } from '@nestjs/common';
import { RelationalSubcategoryPersistenceModule } from './infastructure/persistence/relational/relational-persistence.module';
import { SubcategoryController } from './subcategories.controller';
import { SubcategoryService } from './subcategories.service';
const infrastructurePersistenceModule = RelationalSubcategoryPersistenceModule;
@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [SubcategoryController],
  providers: [SubcategoryService],
  exports: [SubcategoryService, infrastructurePersistenceModule],
})
export class SubcategoryModule {}
