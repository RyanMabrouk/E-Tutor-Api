import { RoleEntity } from 'src/routes/roles/infrastructure/persistence/relational/entities/role.entity';
import { User } from '../../../../domain/user';
import { UserEntity } from '../entities/user.entity';
import { FileEntity } from 'src/routes/files/infrastructure/persistence/relational/entities/file.entity';
import { StatusEntity } from 'src/routes/statuses/infrastructure/persistence/relational/entities/status.entity';
import { FileMapper } from 'src/routes/files/infrastructure/persistence/relational/mappers/file.mapper';
import { RolesMapper } from 'src/routes/roles/infrastructure/persistence/relational/role.mapper';
import { StatusMapper } from 'src/routes/statuses/infrastructure/persistence/relational/entities/status.mapper';

export class UserMapper {
  static toDomain(raw: Partial<UserEntity>): User {
    const user = new User();
    delete raw.__entity;
    Object.assign(user, raw);
    if (raw.photo) {
      user.photo = FileMapper.toDomain(raw.photo);
    }
    if (raw.role) {
      user.role = RolesMapper.toDomain(raw.role);
    }
    if (raw.status) {
      user.status = StatusMapper.toDomain(raw.status);
    }
    return user;
  }

  static toPersistence(user: Partial<User>): UserEntity {
    let role: RoleEntity | undefined = undefined;

    if (user.role) {
      role = new RoleEntity();
      role.id = user.role.id;
    }

    let photo: FileEntity | undefined | null = undefined;

    if (user.photo) {
      photo = new FileEntity();
      photo.id = user.photo.id;
      photo.path = user.photo.path;
    } else if (user.photo === null) {
      photo = null;
    }

    let status: StatusEntity | undefined = undefined;

    if (user.status) {
      status = new StatusEntity();
      status.id = user.status.id;
    }

    const userEntity = new UserEntity();
    Object.assign(userEntity, user);

    if (user.id && typeof user.id === 'number') {
      userEntity.id = user.id;
    }
    userEntity.photo = photo;
    userEntity.role = role;
    userEntity.status = status;
    return userEntity;
  }
}
