import { Lecture } from 'src/routes/lectures/domain/lecture';
import { User } from 'src/routes/users/domain/user';
import { GeneralDomain } from 'src/shared/domain/general.domain';

export class Comment extends GeneralDomain {
  id: number;
  content: string;
  replyTo: Comment | null;
  user: User;
  lecture: Lecture;
}
