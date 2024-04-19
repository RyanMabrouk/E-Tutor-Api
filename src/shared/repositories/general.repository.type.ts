import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { DeepPartial } from 'typeorm';

export abstract class GeneralRepositoryType<Domain, Filter, Sort, DomainId> {
  abstract create(
    data: Omit<Domain, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Domain>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: Filter | null;
    sortOptions?: Sort[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Domain[]>;

  abstract findOne(fields: EntityCondition<Domain>): Promise<Domain>;

  abstract update(id: DomainId, payload: DeepPartial<Domain>): Promise<Domain>;

  abstract softDelete(id: DomainId): Promise<void>;
}
