import { SortDto } from '../../../shared/dto/sort.dto';
import { QueryDto } from '../../../shared/dto/query.dto';
import { FindOptionsWhere } from 'typeorm';
import { RefundEntity } from '../infastructure/persistence/relational/entities/refund.entity';
import { Refund } from '../domain/refund';

export type FilterRefundDto = FindOptionsWhere<RefundEntity>;

export class SortRefundDto extends SortDto<Refund> {}

export class QueryRefundDto extends QueryDto<Refund, FilterRefundDto> {}
