import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { Exclude } from 'class-transformer';
import { Course } from 'src/routes/courses/domain/course';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @Exclude()
  course: Course;
}
