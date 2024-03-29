import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import {
  FilterTaskDto,
  SortTaskDto,
} from 'src/routes/tasks/dto/query-task.dto';
import { Task } from 'src/routes/tasks/domain/task';

export abstract class TaskRepository {
  abstract create(
    data: Omit<Task, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Task>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterTaskDto | null;
    sortOptions?: SortTaskDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Task[]>;

  abstract findOne(fields: EntityCondition<Task>): Promise<NullableType<Task>>;

  abstract update(
    id: Task['id'],
    payload: DeepPartial<Task>,
  ): Promise<Task | null>;

  abstract softDelete(id: Task['id']): Promise<void>;
}
