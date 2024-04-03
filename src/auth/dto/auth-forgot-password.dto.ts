import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class AuthForgotPasswordDto {
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string;
}
