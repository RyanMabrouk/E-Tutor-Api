import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';
import { lowerCaseTransformer } from '../../../utils/transformers/lower-case.transformer';
import { RoleDto } from '../../../routes/roles/dto/role.dto';
import { StatusDto } from '../../../routes/statuses/dto/status.dto';
import { FileDto } from '../../../routes/files/dto/file.dto';
import { User } from '../domain/user';
import { AuthProvidersEnum } from '../../../auth/auth-providers.enum';
import { GeneralDomainKeysWithId } from '../../../shared/domain/general.domain';

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
}
