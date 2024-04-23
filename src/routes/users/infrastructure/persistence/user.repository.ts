import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { User } from '../../domain/user';
import { FilterUserDto, SortUserDto } from '../../dto/query-user.dto';
import { GeneralRepositoryType } from 'src/shared/repositories/general.repository.type';
import { FindOneOptions } from 'typeorm';
import { UserEntity } from './relational/entities/user.entity';

export abstract class UserRepository extends GeneralRepositoryType<
  User,
  FilterUserDto,
  SortUserDto,
  User['id']
> {
  abstract findOne(
    fields: EntityCondition<User>,
    relations?: FindOneOptions<UserEntity>['relations'],
  ): Promise<User>;
}
