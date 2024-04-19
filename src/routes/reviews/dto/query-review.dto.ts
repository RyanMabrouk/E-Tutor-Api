import { SortDto } from 'src/shared/dto/sort.dto';
import { QueryDto } from 'src/shared/dto/query.dto';
import { FindOptionsWhere } from 'typeorm';
import { ReviewEntity as ReviewEntity } from '../infastructure/persistence/relational/entities/review.entity';
import { Review } from '../domain/review';
import { Transform } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export type FilterReviewDto = FindOptionsWhere<ReviewEntity>;

export class SortReviewDto extends SortDto<Review> {}

export class QueryReviewDto extends QueryDto<Review, FilterReviewDto> {
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsPositive()
  courseId: number;
}
