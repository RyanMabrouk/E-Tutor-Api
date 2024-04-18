import { Section } from 'src/routes/sections/domain/section';
import { LectureEntity } from '../entities/lecture.entity';
import { Lecture } from 'src/routes/lectures/domain/lecture';
import { SectionMapper } from 'src/routes/sections/infastructure/persistence/relational/mappers/section.mapper';
import { FileMapper } from 'src/routes/files/infrastructure/persistence/relational/mappers/file.mapper';

export class LectureMapper {
  static toDomain(entity: Partial<LectureEntity>): Lecture {
    const domain = new Lecture();
    delete entity.__entity;
    Object.assign(domain, entity);
    if (entity.section) {
      domain.section = SectionMapper.toDomain(entity.section);
    }
    if (entity.video) {
      domain.video = FileMapper.toDomain(entity.video);
    }
    if (entity.attachement) {
      domain.attachement = FileMapper.toDomain(entity.attachement);
    }
    return domain;
  }

  static toPersistence(domain: Partial<Lecture>): LectureEntity {
    const entity = new LectureEntity();
    Object.assign(entity, domain);
    if (domain.section) {
      entity.section = SectionMapper.toPersistence(domain.section as Section);
    }
    if (domain.video) {
      entity.video = FileMapper.toPersistence(domain.video);
    }
    if (domain.attachement) {
      entity.attachement = FileMapper.toPersistence(domain.attachement);
    }
    return entity;
  }
}
