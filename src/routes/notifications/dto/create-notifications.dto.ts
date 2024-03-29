import {
  IsString,
  Validate,
  IsNotEmpty,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator';
import { GeneralDomainKeysWithId } from 'src/shared/domain/general.domain';
import { Notification } from '../domain/notifications';
import { User } from 'src/routes/users/domain/user';

@ValidatorConstraint({ name: 'IsUserConstraint', async: false })
export class IsUserConstraint implements ValidatorConstraintInterface {
  validate(user: any) {
    return user && typeof user.id === 'number';
  }
  defaultMessage() {
    return `Each user must be a user object with a numeric id`;
  }
}

export class CreateNotificationsDto
  implements Omit<Notification, GeneralDomainKeysWithId | 'sender'>
{
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  seen: boolean = false;

  @IsArray()
  @ArrayNotEmpty()
  @Validate(IsUserConstraint, { each: true })
  receivers: User[];
}
