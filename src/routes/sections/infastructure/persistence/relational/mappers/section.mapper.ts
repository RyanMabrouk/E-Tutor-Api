import { omit } from 'lodash';
import { CourseMapper } from 'src/routes/courses/infastructure/persistence/relational/mappers/course.mapper';
import { SectionEntity } from '../entities/section.entity';
import { Section } from 'src/routes/sections/domain/section';
import { GeneralDomainKeysArray } from 'src/shared/domain/general.domain';

export class SectionMapper {
  static toDomain(entity: Partial<SectionEntity>): Section {
    const domain = new Section();
    delete entity.__entity;
    Object.assign(domain, entity);
    if (entity.course) {
      domain.course = CourseMapper.toDomain(entity.course);
    }
    return omit(domain, GeneralDomainKeysArray) as Section;
  }
  static toPersistence(domain: Partial<Section>): SectionEntity {
    const entity = new SectionEntity();
    Object.assign(entity, domain);
    if (domain.course) {
      entity.course = CourseMapper.toPersistence(domain.course);
    }
    return entity;
  }
}
