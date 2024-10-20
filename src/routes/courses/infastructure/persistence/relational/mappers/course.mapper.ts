import { CourseEntity } from '../entities/course.entity';
import { CategoryMapper } from 'src/routes/categories/infastructure/persistence/relational/mappers/category.mapper';
import { Course } from 'src/routes/courses/domain/course';
import { SubcategoryMapper } from 'src/routes/subcategories/infastructure/persistence/relational/mappers/subcategory.mapper';
import { LanguageMapper } from 'src/routes/languages/infastructure/persistence/relational/mappers/language.mapper';
import { FileMapper } from 'src/routes/files/infrastructure/persistence/relational/mappers/file.mapper';
import { UserMapper } from 'src/routes/users/infrastructure/persistence/relational/mappers/user.mapper';

export class CourseMapper {
  static toDomain(entity: Partial<CourseEntity>): Course {
    const domain = new Course();
    delete entity.__entity;
    Object.assign(domain, entity);
    if (entity.category)
      domain.category = CategoryMapper.toDomain(entity.category);
    if (entity.subcategory)
      domain.subcategory = SubcategoryMapper.toDomain(entity.subcategory);
    if (entity.language)
      domain.language = LanguageMapper.toDomain(entity.language);
    if (entity.subtitleLanguage)
      domain.subtitleLanguage = entity.subtitleLanguage.map((language) =>
        LanguageMapper.toDomain(language),
      );
    if (entity.thumbnail)
      domain.thumbnail = FileMapper.toDomain(entity.thumbnail);
    if (entity.trailer) domain.trailer = FileMapper.toDomain(entity.trailer);
    if (entity.instructors)
      domain.instructors = entity.instructors.map((instructor) =>
        UserMapper.toDomain(instructor),
      );
    return domain;
  }

  static toPersistence(domain: Partial<Course>): CourseEntity {
    const entity = new CourseEntity();
    Object.assign(entity, domain);
    if (domain.category)
      entity.category = CategoryMapper.toPersistence(domain.category);
    if (domain.subcategory)
      entity.subcategory = SubcategoryMapper.toPersistence(domain.subcategory);
    if (domain.language)
      entity.language = LanguageMapper.toPersistence(domain.language);
    if (domain.subtitleLanguage)
      entity.subtitleLanguage = domain.subtitleLanguage.map((language) =>
        LanguageMapper.toPersistence(language),
      );
    if (domain.thumbnail)
      entity.thumbnail = FileMapper.toPersistence(domain.thumbnail);
    if (domain.trailer)
      entity.trailer = FileMapper.toPersistence(domain.trailer);
    if (domain.instructors)
      entity.instructors = domain.instructors.map((instructor) =>
        UserMapper.toPersistence(instructor),
      );
    return entity;
  }
}
