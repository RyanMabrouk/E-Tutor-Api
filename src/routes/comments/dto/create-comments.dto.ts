import {
  IsString,
  Validate,
  IsNotEmpty,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { GeneralDomainKeysWithId } from 'src/shared/domain/general.domain';
import { IsObjectWithNumericIdConstraint } from 'src/utils/class-validators/IsObjectWithNumericIdConstraint';
import { Comment } from '../domain/comments';
import { Lecture } from 'src/routes/lectures/domain/lecture';
import { Optional } from '@nestjs/common';
@ValidatorConstraint({ name: 'ReplyToConstraint', async: false })
class ReplyToConstraint implements ValidatorConstraintInterface {
  validate(object: any) {
    const isValid =
      (object && typeof object.id === 'number') || object === null;
    return isValid;
  }
  defaultMessage() {
    return 'Property must be an object with a numeric id';
  }
}
export class CreateCommentDto
  implements Omit<Comment, GeneralDomainKeysWithId | 'user'>
{
  @IsString()
  @IsNotEmpty()
  content: string;

  @Optional()
  @Validate(ReplyToConstraint)
  replyTo: Comment | null = null;

  @Validate(IsObjectWithNumericIdConstraint)
  lecture: Lecture;
}
