import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsDateString,
  ArrayNotEmpty,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
} from 'class-validator';
import { User } from 'src/routes/users/domain/user';
import { Project } from '../domain/project';
import { GeneralDomainKeysWithId } from 'src/shared/domain/general.domain';

@ValidatorConstraint({ async: true })
export class IsUserConstraint implements ValidatorConstraintInterface {
  validate(user: any) {
    return user && typeof user.id === 'number'; // checks if user is an instance of User
  }
  defaultMessage() {
    return 'Each member must be a user object with a numeric id';
  }
}
export class CreateProjectDto
  implements Omit<Project, GeneralDomainKeysWithId>
{
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @Validate(IsUserConstraint, { each: true })
  members: User[];

  @IsDateString()
  due_date: Date;
}
