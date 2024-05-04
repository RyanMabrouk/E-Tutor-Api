import {
  IsNotEmpty,
  Validate,
  IsArray,
  ArrayNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Course } from 'src/routes/courses/domain/course';
import { IsObjectWithNumericIdConstraint } from 'src/utils/class-validators/IsObjectWithNumericIdConstraint';

export class GiftCoursesDto {
  @IsArray()
  @ArrayNotEmpty()
  @Validate(IsObjectWithNumericIdConstraint, { each: true })
  @IsNotEmpty()
  courses: Course[];

  @IsString()
  @IsOptional()
  couponCode: string;

  @IsNumber()
  @IsNotEmpty()
  recieverId: number;
}
