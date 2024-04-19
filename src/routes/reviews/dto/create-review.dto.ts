import {
  IsString,
  Validate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { Review } from '../domain/review';
import { GeneralDomainKeysWithId } from 'src/shared/domain/general.domain';
import { IsObjectWithNumericIdConstraint } from 'src/utils/class-validators/IsObjectWithNumericIdConstraint';
import { Course } from 'src/routes/courses/domain/course';
import { IsLessThan } from 'src/utils/class-validators/IsLessThen';

export class CreateReviewDto
  implements Omit<Review, GeneralDomainKeysWithId | 'user'>
{
  @IsString()
  @IsNotEmpty()
  content: string;

  @Validate(IsObjectWithNumericIdConstraint)
  course: Course;

  @IsNumber()
  @IsPositive()
  @IsLessThan(5)
  rating: number;
}
