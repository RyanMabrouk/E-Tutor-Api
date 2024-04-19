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
  IsJSON,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Category } from 'src/routes/categories/domain/category';
import { FileType } from 'src/routes/files/domain/file';
import { Language } from 'src/routes/languages/domain/language';
import { Subcategory } from 'src/routes/subcategories/domain/subcategory';
import { GeneralDomainKeysWithId } from 'src/shared/domain/general.domain';
import { Course, CourseLevelEnum, CourseLevelType } from '../domain/course';
import { User } from 'src/routes/users/domain/user';
import { IsLessThan } from 'src/utils/class-validators/IsLessThen';
import { IsObjectWithNumericIdConstraint } from 'src/utils/class-validators/IsObjectWithNumericIdConstraint';
import { IsUserConstraint } from 'src/utils/class-validators/IsUserConstraint';
import { IsObjectWithStringIdConstraint } from 'src/utils/class-validators/IsObjectWithStringIdConstraint';

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
export class CreateCourseDto implements Omit<Course, GeneralDomainKeysWithId> {
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

  @Validate(IsObjectWithStringIdConstraint)
  thumbnail: FileType;

  @Validate(IsObjectWithStringIdConstraint)
  trailer: FileType;

  @IsJSON()
  description: JSON;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  subjects: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  audience: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  requirements: string[];

  @IsString()
  @IsNotEmpty()
  welcomeMessage: string;

  @IsString()
  @IsNotEmpty()
  congratsMessage: string;

  @IsNumber()
  @Validate(ValidatePriceConstraint)
  price: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsLessThan(100)
  discount: number;

  @IsArray()
  @ArrayNotEmpty()
  @Validate(IsUserConstraint, { each: true })
  instructors: User[];
}
