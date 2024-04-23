import {
  IsString,
  Validate,
  IsNotEmpty,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  IsBoolean,
} from 'class-validator';
import { Message } from '../domain/message';
import { MessageTypes, MessageTypesType } from '../types/MessageTypes';
import { Chat } from 'src/routes/chat/domain/chat';
import { GeneralDomainKeysWithId } from 'src/shared/domain/general.domain';
import { IsObjectWithNumericIdConstraint } from 'src/utils/class-validators/IsObjectWithNumericIdConstraint';

@ValidatorConstraint({ name: 'isMessageType', async: false })
export class IsMessageType implements ValidatorConstraintInterface {
  validate(value: any) {
    return Object.values(MessageTypes).includes(value);
  }
  defaultMessage() {
    return `Type must be a valid MessageType value (${Object.values(MessageTypes)})`;
  }
}

export class CreateMessageDto
  implements Omit<Message, GeneralDomainKeysWithId | 'sender'>
{
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsMessageType)
  type: MessageTypesType;

  @Validate(IsObjectWithNumericIdConstraint)
  chat: Chat;

  @IsBoolean()
  seen: boolean = false;
}
