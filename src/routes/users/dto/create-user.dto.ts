import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsUrl,
  MinLength,
  Validate,
} from 'class-validator';
import { lowerCaseTransformer } from '../../../utils/transformers/lower-case.transformer';
import { RoleDto } from '../../../routes/roles/dto/role.dto';
import { StatusDto } from '../../../routes/statuses/dto/status.dto';
import { FileDto } from '../../../routes/files/dto/file.dto';
import { User } from '../domain/user';
import { AuthProvidersEnum } from '../../../auth/auth-providers.enum';
import { GeneralDomainKeysWithId } from '../../../shared/domain/general.domain';
import { IsObjectWithNumericIdConstraint } from 'src/utils/class-validators/IsObjectWithNumericIdConstraint';
import { Course } from 'src/routes/courses/domain/course';

export class CreateUserDto implements Omit<User, GeneralDomainKeysWithId> {
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @MinLength(6)
  password?: string;

  @IsEnum(AuthProvidersEnum)
  provider: string;

  socialId?: string | null;

  @IsNotEmpty()
  firstName: string | null;

  @IsNotEmpty()
  lastName: string | null;

  @IsOptional()
  photo?: FileDto | null;

  @IsOptional()
  @Type(() => RoleDto)
  role?: RoleDto | null;

  @IsOptional()
  @Type(() => StatusDto)
  status?: StatusDto;

  hash?: string | null;

  @IsOptional()
  @IsNotEmpty()
  username?: string;

  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  bigoraphie?: string;

  @IsOptional()
  @IsUrl()
  persenalWebsite?: string;

  @IsOptional()
  linkedin?: string;

  @IsOptional()
  @IsNotEmpty()
  twitter?: string;

  @IsOptional()
  @IsNotEmpty()
  facebook?: string;

  @IsOptional()
  @IsNotEmpty()
  instagram?: string;

  @IsOptional()
  @IsPhoneNumber()
  whatsapp?: string;

  @IsOptional()
  @IsNotEmpty()
  youtube?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Validate(IsObjectWithNumericIdConstraint, { each: true })
  courses: Course[];
}
