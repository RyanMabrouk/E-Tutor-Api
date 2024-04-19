import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Review } from '../../domain/review';
import { FilterReviewDto, SortReviewDto } from '../../dto/query-review.dto';
import { GeneralRepositoryType } from 'src/shared/repositories/general.repository.type';
import { Course } from 'src/routes/courses/domain/course';
import { ReviewsWithRatingCount } from '../../types/types';

export abstract class ReviewRepository extends GeneralRepositoryType<
  Review,
  FilterReviewDto,
  SortReviewDto,
  Review['id']
> {
  // @ts-expect-error stupid ts
  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
    courseId,
  }: {
    filterOptions?: FilterReviewDto | null;
    sortOptions?: SortReviewDto[] | null;
    paginationOptions: IPaginationOptions;
    courseId: Course['id'];
  }): Promise<ReviewsWithRatingCount>;
}
