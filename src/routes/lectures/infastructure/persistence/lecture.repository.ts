import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { GeneralRepositoryType } from '../../../../shared/repositories/general.repository.type';
import { Lecture } from '../../domain/lecture';
import { FilterLectureDto, SortLectureDto } from '../../dto/query-lecture.dto';
import { Section } from 'src/routes/sections/domain/section';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { FindOneOptions } from 'typeorm';
import { SectionEntity } from 'src/routes/sections/infastructure/persistence/relational/entities/section.entity';

export abstract class LectureRepository extends GeneralRepositoryType<
  Lecture,
  FilterLectureDto,
  SortLectureDto,
  Lecture['id']
> {
  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
    sectionId,
  }: {
    filterOptions?: FilterLectureDto | null;
    sortOptions?: SortLectureDto[] | null;
    paginationOptions: IPaginationOptions;
    sectionId: Section['id'];
  }): Promise<Lecture[]>;

  abstract findOne(
    fields: EntityCondition<Lecture>,
    relations?: FindOneOptions<SectionEntity>['relations'],
  ): Promise<Lecture>;

  abstract getLectureCourseId(lectureId: Lecture['id']): Promise<number>;
}
