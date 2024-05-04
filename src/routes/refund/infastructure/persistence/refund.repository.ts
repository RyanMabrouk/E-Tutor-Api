import { Refund } from '../../domain/refund';
import { FilterRefundDto, SortRefundDto } from '../../dto/query-refund.dto';
import { GeneralRepositoryType } from '../../../../shared/repositories/general.repository.type';

export abstract class RefundRepository extends GeneralRepositoryType<
  Refund,
  FilterRefundDto,
  SortRefundDto,
  Refund['id']
> {}
