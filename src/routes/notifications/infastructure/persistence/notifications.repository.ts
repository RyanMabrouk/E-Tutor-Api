import { User } from '../../../../routes/users/domain/user';
import { Notification } from '../../domain/notifications';
import {
  FilterNotificationsDto,
  SortNotificationsDto,
} from '../../dto/query-notifications.dto';
import { GeneralRepositoryType } from '../../../../shared/repositories/general.repository.type';
import { IPaginationOptions } from '../../../../utils/types/pagination-options';

export abstract class NotificationsRepository extends GeneralRepositoryType<
  Notification,
  FilterNotificationsDto,
  SortNotificationsDto,
  Notification['id']
> {
  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
    userId,
  }: {
    filterOptions?: FilterNotificationsDto | null;
    sortOptions?: SortNotificationsDto[] | null;
    paginationOptions: IPaginationOptions;
    userId: User['id'];
  }): Promise<Notification[]>;
}
