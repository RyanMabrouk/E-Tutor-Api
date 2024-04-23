import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-message.dto';
import { Exclude } from 'class-transformer';
import { MessageTypes } from '../types/MessageTypes';
import { Chat } from 'src/routes/chat/domain/chat';
import { User } from 'src/routes/users/domain/user';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  @Exclude()
  type?: MessageTypes;

  @Exclude()
  chat?: Chat;

  @Exclude()
  sender?: User;
}
