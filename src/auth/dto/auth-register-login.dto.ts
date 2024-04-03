import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { RoleEnum } from 'src/routes/roles/roles.enum';

export class AuthRegisterLoginDto {
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  roleId: number = RoleEnum.user;
}
