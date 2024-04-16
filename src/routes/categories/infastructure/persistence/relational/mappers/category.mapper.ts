import { Category } from '../../../../../categories/domain/category';
import { CategoryEntity } from '../entities/category.entity';

export class CategoryMapper {
  static toDomain(raw: CategoryEntity): Category {
    const category = new Category();
    delete raw.__entity;
    Object.assign(category, raw);
    return category;
  }

  static toPersistence(entity: Category): CategoryEntity {
    const categEntity = new CategoryEntity();
    Object.assign(categEntity, entity);
    return categEntity;
  }
}
