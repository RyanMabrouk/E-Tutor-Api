import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Transform, Type } from 'class-transformer';
import { IsEmail, IsOptional, MinLength } from 'class-validator';
import { RoleDto } from 'src/routes/roles/dto/role.dto';
import { StatusDto } from 'src/routes/statuses/dto/status.dto';
import { FileDto } from 'src/routes/files/dto/file.dto';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @IsOptional()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string | null;

  @IsOptional()
  firstName?: string | null;

  @IsOptional()
  lastName?: string | null;

  @IsOptional()
  learningGoal?: number | null;

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
