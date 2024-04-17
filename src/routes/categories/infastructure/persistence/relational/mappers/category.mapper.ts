import { GeneralDomainKeysArray } from 'src/shared/domain/general.domain';
import { Category } from '../../../../../categories/domain/category';
import { CategoryEntity } from '../entities/category.entity';
import { omit } from 'lodash';

export class CategoryMapper {
  static toDomain(raw: CategoryEntity): Category {
    const category = new Category();
    delete raw.__entity;
    Object.assign(category, raw);
    return omit(category, GeneralDomainKeysArray) as Category;
  }

  static toPersistence(entity: Category): CategoryEntity {
    const categEntity = new CategoryEntity();
    Object.assign(categEntity, entity);
    return categEntity;
  }
}
