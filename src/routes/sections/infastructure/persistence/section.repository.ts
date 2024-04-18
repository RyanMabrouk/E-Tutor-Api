import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { GeneralRepositoryType } from '../../../../shared/repositories/general.repository.type';
import { Section } from '../../domain/section';
import { FilterSectionDto, SortSectionDto } from '../../dto/query-section.dto';
import { Course } from 'src/routes/courses/domain/course';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { SectionEntity } from './relational/entities/section.entity';
import { FindOneOptions } from 'typeorm';

export abstract class SectionRepository extends GeneralRepositoryType<
  Section,
  FilterSectionDto,
  SortSectionDto,
  Section['id']
> {
  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
    courseId,
  }: {
    filterOptions?: FilterSectionDto | null;
    sortOptions?: SortSectionDto[] | null;
    paginationOptions: IPaginationOptions;
    courseId: Course['id'];
  }): Promise<Section[]>;

  abstract findOne(
    fields: EntityCondition<Section>,
    relations?: FindOneOptions<SectionEntity>['relations'],
  ): Promise<Section>;
}
