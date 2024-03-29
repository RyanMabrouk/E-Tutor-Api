import { Status } from 'src/routes/statuses/domain/status';
import { StatusEntity } from './status.entity';

export class StatusMapper {
  static toDomain(raw: StatusEntity): Status {
    const domain = new Status();
    delete raw.__entity;
    Object.assign(domain, raw);
    return domain;
  }

  static toPersistence(entity: Status): StatusEntity {
    const Entity = new StatusEntity();
    Object.assign(Entity, entity);
    return Entity;
  }
}
