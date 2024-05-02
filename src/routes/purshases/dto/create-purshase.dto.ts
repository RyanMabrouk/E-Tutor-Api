import { IsNotEmpty, Validate, IsArray, ArrayNotEmpty } from 'class-validator';
import { Course } from 'src/routes/courses/domain/course';
import { IsObjectWithNumericIdConstraint } from 'src/utils/class-validators/IsObjectWithNumericIdConstraint';

export class CreatePurshaseDto {
  @IsArray()
  @ArrayNotEmpty()
  @Validate(IsObjectWithNumericIdConstraint, { each: true })
  @IsNotEmpty()
  courses: Course[];

  // @IsNumber()
  // @IsNotEmpty()
  // discount: number;

  // @IsNumber()
  // @IsNotEmpty()
  // totalPrice: number;

  // @IsOptional()
  // @IsArray()
  // @ArrayNotEmpty()
  // @Validate(IsObjectWithNumericIdConstraint)
  // user?: User;
}
