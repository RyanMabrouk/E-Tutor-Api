import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { GeneralRepositoryType } from '../../../../shared/repositories/general.repository.type';
import { Progress } from '../../domain/progress';
import {
  FilterProgressDto,
  SortProgressDto,
} from '../../dto/query-progress.dto';
// import { Course } from 'src/routes/courses/domain/course';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { ProgressEntity } from './relational/entities/progress.entity';
import { FindOneOptions } from 'typeorm';

export abstract class ProgressRepository extends GeneralRepositoryType<
  Progress,
  FilterProgressDto,
  SortProgressDto,
  Progress['id']
> {
  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterProgressDto | null;
    sortOptions?: SortProgressDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Progress[]>;

  abstract findOne(
    fields: EntityCondition<Progress>,
    relations?: FindOneOptions<ProgressEntity>['relations'],
  ): Promise<Progress>;
}
