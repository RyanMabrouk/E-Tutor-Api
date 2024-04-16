import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubcategoryRepository } from '../subcategories.repository';
import { SubcategoryEntity } from './entities/subcategory.entity';
import { SubcategoryRelationalRepository } from './repositories/subcategory.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SubcategoryEntity])],
  providers: [
    {
      provide: SubcategoryRepository,
      useClass: SubcategoryRelationalRepository,
    },
  ],
  exports: [SubcategoryRepository],
})
export class RelationalSubcategoryPersistenceModule {}
