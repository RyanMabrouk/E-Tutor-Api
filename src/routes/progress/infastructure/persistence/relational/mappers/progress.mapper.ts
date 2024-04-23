import { omit } from 'lodash';
import { ProgressEntity } from '../entities/progress.entity';
import { GeneralDomainKeysArray } from 'src/shared/domain/general.domain';
import { Progress } from 'src/routes/progress/domain/progress';

export class ProgressMapper {
  static toDomain(entity: Partial<ProgressEntity>): Progress {
    const domain = new Progress();
    delete entity.__entity;
    Object.assign(domain, entity);
    // if (entity.lecture) {
    //   domain.lecture = ProgressMapper.toDomain(entity.lecture);
    // }
    return omit(domain, GeneralDomainKeysArray) as Progress;
  }
  static toPersistence(domain: Partial<Progress>): ProgressEntity {
    const entity = new ProgressEntity();
    Object.assign(entity, domain);
    // if (domain.lecture) {
    //   entity.lecture = ProgressEntity.toPersistence(domain.lecture);
    // }
    return entity;
  }
}
