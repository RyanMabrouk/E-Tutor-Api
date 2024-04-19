import { User } from '../../domain/user';
import { FilterUserDto, SortUserDto } from '../../dto/query-user.dto';
import { GeneralRepositoryType } from 'src/shared/repositories/general.repository.type';

export abstract class UserRepository extends GeneralRepositoryType<
  User,
  FilterUserDto,
  SortUserDto,
  User['id']
> {}
