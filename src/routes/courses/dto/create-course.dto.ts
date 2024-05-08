import {
  IsString,
  IsNotEmpty,
  Validate,
  ValidatorConstraintInterface,
  ValidatorConstraint,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Category } from 'src/routes/categories/domain/category';
import { FileType } from 'src/routes/files/domain/file';
import { Language } from 'src/routes/languages/domain/language';
import { Subcategory } from 'src/routes/subcategories/domain/subcategory';
import { GeneralDomainKeysWithId } from 'src/shared/domain/general.domain';
import { Course } from '../domain/course';
import { CourseLevelEnum, CourseLevelType } from '../types/CourseLevelType';
import { User } from 'src/routes/users/domain/user';
import { IsLessThan } from 'src/utils/class-validators/IsLessThen';
import { IsObjectWithNumericIdConstraint } from 'src/utils/class-validators/IsObjectWithNumericIdConstraint';
import { IsUserConstraint } from 'src/utils/class-validators/IsUserConstraint';
import { IsObjectWithStringIdConstraint } from 'src/utils/class-validators/IsObjectWithStringIdConstraint';
import { CourseStatusEnum, CourseStatusType } from '../types/CourseStatusType';

@ValidatorConstraint({ name: 'ValidateDuration', async: false })
export class ValidateDurationConstraint
  implements ValidatorConstraintInterface
{
  validate(value: number) {
    return value < 365 && value > 0;
  }
  defaultMessage() {
    return 'Duration must be between 1 and 365';
  }
}
@ValidatorConstraint({ name: 'ValidatePrice', async: false })
export class ValidatePriceConstraint implements ValidatorConstraintInterface {
  validate(value: number) {
    return value < 999 && value >= 0;
  }
  defaultMessage() {
    return 'Duration must be between 0 and 999';
  }
}
export class CreateCourseDto
  implements Partial<Omit<Course, GeneralDomainKeysWithId>>
{
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  subtitle: string;

  @Validate(IsObjectWithNumericIdConstraint)
  category: Category;

  @Validate(IsObjectWithNumericIdConstraint)
  subcategory: Subcategory;

  @IsString()
  @IsNotEmpty()
  topic: string;

  @Validate(IsObjectWithNumericIdConstraint)
  language: Language;

  @IsArray()
  @ArrayNotEmpty()
  @Validate(IsObjectWithNumericIdConstraint, { each: true })
  subtitleLanguage: Language[];

  @IsString()
  @IsNotEmpty()
  @IsEnum(CourseLevelEnum)
  level: CourseLevelType;

  @IsNumber()
  @IsPositive()
  @Validate(ValidateDurationConstraint)
  duration: number;

  @IsOptional()
  @Validate(IsObjectWithStringIdConstraint)
  thumbnail?: FileType | null;

  @IsOptional()
  @Validate(IsObjectWithStringIdConstraint)
  trailer?: FileType | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string | null;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  subjects?: string[] | null;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  audience?: string[] | null;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  requirements?: string[] | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  welcomeMessage?: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  congratsMessage?: string | null;

  @IsOptional()
  @IsNumber()
  @Validate(ValidatePriceConstraint)
  price?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsLessThan(100)
  discount?: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Validate(IsUserConstraint, { each: true })
  instructors?: User[];

  @IsOptional()
  @IsEnum(CourseStatusEnum)
  status?: CourseStatusType;
}
