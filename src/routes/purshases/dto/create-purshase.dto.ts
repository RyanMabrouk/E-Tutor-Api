import {
  IsNotEmpty,
  Validate,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Course } from 'src/routes/courses/domain/course';
import { IsObjectWithNumericIdConstraint } from 'src/utils/class-validators/IsObjectWithNumericIdConstraint';

export class CreatePurshaseDto {
  @IsNotEmpty()
  @IsNumber()
  discount: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  @Validate(IsObjectWithNumericIdConstraint, { each: true })
  courses?: Course[];

  @IsNotEmpty()
  @IsOptional()
  coursesIds?: number[];
}
