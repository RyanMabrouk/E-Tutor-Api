import { IsString, IsArray, ArrayNotEmpty, Validate } from 'class-validator';
import { User } from 'src/routes/users/domain/user';
import { Chat } from '../domain/chat';
import { GeneralDomainKeysWithId } from 'src/shared/domain/general.domain';
import { IsUserConstraint } from 'src/utils/class-validators/IsUserConstraint';

export class CreateChatDto implements Omit<Chat, GeneralDomainKeysWithId> {
  @IsString()
  title: string;

  @IsArray()
  @ArrayNotEmpty()
  @Validate(IsUserConstraint, { each: true })
  members: User[];
}
