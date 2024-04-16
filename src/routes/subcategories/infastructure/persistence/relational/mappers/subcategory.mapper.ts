import { Subcategory } from 'src/routes/subcategories/domain/subcategory';
import { SubcategoryEntity } from '../entities/subcategory.entity';

export class SubcategoryMapper {
  static toDomain(raw: SubcategoryEntity): Subcategory {
    const category = new Subcategory();
    delete raw.__entity;
    Object.assign(category, raw);
    return category;
  }

  static toPersistence(entity: Subcategory): SubcategoryEntity {
    const categEntity = new SubcategoryEntity();
    Object.assign(categEntity, entity);
    return categEntity;
  }
}
