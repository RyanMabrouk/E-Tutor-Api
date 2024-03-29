import { Role } from 'src/routes/roles/domain/role';
import { RoleEntity } from './entities/role.entity';

export class RolesMapper {
  static toDomain(raw: RoleEntity): Role {
    const domain = new Role();
    delete raw.__entity;
    Object.assign(domain, raw);
    return domain;
  }

  static toPersistence(entity: Role): RoleEntity {
    const Entity = new RoleEntity();
    Object.assign(Entity, entity);
    return Entity;
  }
}
