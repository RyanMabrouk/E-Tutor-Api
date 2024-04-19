import { Purshase } from '../../domain/purshase';
import {
  FilterPurshaseDto,
  SortPurshaseDto,
} from '../../dto/query-purshase.dto';
import { GeneralRepositoryType } from '../../../../shared/repositories/general.repository.type';

export abstract class PurshaseRepository extends GeneralRepositoryType<
  Purshase,
  FilterPurshaseDto,
  SortPurshaseDto,
  Purshase['id']
> {}
