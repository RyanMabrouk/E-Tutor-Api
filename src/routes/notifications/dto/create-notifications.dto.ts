import {
  IsString,
  Validate,
  IsNotEmpty,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { GeneralDomainKeysWithId } from 'src/shared/domain/general.domain';
import { Notification } from '../domain/notifications';
import { User } from 'src/routes/users/domain/user';
import { IsUserConstraint } from 'src/utils/class-validators/IsUserConstraint';

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
