import { GeneralDomainKeysArray } from 'src/shared/domain/general.domain';
import { PurshaseEntity } from '../entities/purshase';
import { omit } from 'lodash';
import { Purshase } from '../../../../domain/purshase';

export class PurshaseMapper {
  static toDomain(raw: PurshaseEntity): Purshase {
    const purshase = new Purshase();
    delete raw.__entity;
    Object.assign(purshase, raw);
    return omit(purshase, GeneralDomainKeysArray) as Purshase;
  }

  static toPersistence(entity: Purshase): PurshaseEntity {
    const purshaseEntity = new PurshaseEntity();
    Object.assign(purshaseEntity, entity);
    return purshaseEntity;
  }
}
