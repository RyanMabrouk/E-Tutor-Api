import {
  IsNotEmpty,
  Validate,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Course } from 'src/routes/courses/domain/course';
import { IsCourseConstraint } from 'src/utils/class-validators/IsUserConstraint copy';

export class CreatePurshaseDto {
  @IsNotEmpty()
  @IsNumber()
  discount: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  @Validate(IsCourseConstraint, { each: true })
  courses?: Course[];

  @IsNotEmpty()
  @IsOptional()
  coursesIds?: number[];
}
