import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificationsDto } from './create-notifications.dto';
import { Exclude } from 'class-transformer';

export class UpdateNotificationsDto extends PartialType(
  CreateNotificationsDto,
) {
  @Exclude()
  receivers: any;
}
