import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { FileDto } from 'src/routes/files/dto/file.dto';

export class AuthUpdateDto {
  @IsOptional()
  photo?: FileDto | null;

  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  firstName?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  lastName?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  oldPassword?: string;
}
