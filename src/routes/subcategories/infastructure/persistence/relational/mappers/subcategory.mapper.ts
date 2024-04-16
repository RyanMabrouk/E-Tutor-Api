import { Subcategory } from 'src/routes/subcategories/domain/subcategory';
import { SubcategoryEntity } from '../entities/subcategory.entity';
import { CategoryMapper } from 'src/routes/categories/infastructure/persistence/relational/mappers/category.mapper';

export class SubcategoryMapper {
  static toDomain(entity: Partial<SubcategoryEntity>): Subcategory {
    const domain = new Subcategory();
    delete entity.__entity;
    Object.assign(domain, entity);
    if (entity.category) {
      domain.category = CategoryMapper.toDomain(entity.category);
    }
    return domain;
  }

  static toPersistence(domain: Subcategory): SubcategoryEntity {
    const entity = new SubcategoryEntity();
    Object.assign(entity, domain);
    if (domain.category) {
      entity.category = CategoryMapper.toPersistence(domain.category);
    }
    return entity;
  }
}
