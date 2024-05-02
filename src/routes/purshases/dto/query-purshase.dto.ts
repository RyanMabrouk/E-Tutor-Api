import { SortDto } from '../../../shared/dto/sort.dto';
import { QueryDto } from '../../../shared/dto/query.dto';
import { FindOptionsWhere } from 'typeorm';
import { PurshaseEntity } from '../infastructure/persistence/relational/entities/purshase.entity';
import { Purshase } from '../domain/purshase';

export type FilterPurshaseDto = FindOptionsWhere<PurshaseEntity>;

export class SortPurshaseDto extends SortDto<Purshase> {}

export class QueryPurshaseDto extends QueryDto<Purshase, FilterPurshaseDto> {}
