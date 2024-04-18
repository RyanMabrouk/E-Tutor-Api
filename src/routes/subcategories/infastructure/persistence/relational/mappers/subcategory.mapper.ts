import { Subcategory } from 'src/routes/subcategories/domain/subcategory';
import { SubcategoryEntity } from '../entities/subcategory.entity';
import { CategoryMapper } from 'src/routes/categories/infastructure/persistence/relational/mappers/category.mapper';
import { GeneralDomainKeysArray } from 'src/shared/domain/general.domain';
import { omit } from 'lodash';

export class SubcategoryMapper {
  static toDomain(entity: Partial<SubcategoryEntity>): Subcategory {
    const domain = new Subcategory();
    delete entity.__entity;
    Object.assign(domain, entity);
    if (entity.category) {
      domain.category = CategoryMapper.toDomain(entity.category);
    }
    return omit(domain, GeneralDomainKeysArray) as Subcategory;
  }

  static toPersistence(domain: Partial<Subcategory>): SubcategoryEntity {
    const entity = new SubcategoryEntity();
    Object.assign(entity, domain);
    if (domain.category) {
      entity.category = CategoryMapper.toPersistence(domain.category);
    }
    return entity;
  }
}
