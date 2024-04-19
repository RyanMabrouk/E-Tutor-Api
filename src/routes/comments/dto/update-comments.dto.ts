import { PartialType } from '@nestjs/mapped-types';
import { Exclude } from 'class-transformer';
import { User } from 'src/routes/users/domain/user';
import { CreateCommentDto } from './create-comments.dto';
import { Comment } from '../domain/comments';
import { Lecture } from 'src/routes/lectures/domain/lecture';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @Exclude()
  replyTo: Comment | null;

  @Exclude()
  user: User;

  @Exclude()
  lecture: Lecture;
}
