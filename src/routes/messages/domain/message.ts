import { Chat } from 'src/routes/chat/domain/chat';
import { User } from 'src/routes/users/domain/user';
import { GeneralDomain } from 'src/shared/domain/general.domain';
import { MessageTypesType } from '../types/MessageTypes';

export class Message extends GeneralDomain {
  id: number;
  content: string;
  type: MessageTypesType;
  seen: boolean;
  chat: Chat;
  sender: User;
}
