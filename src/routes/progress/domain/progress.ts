import { GeneralDomain } from '../../../shared/domain/general.domain';
import { Lecture } from 'src/routes/lectures/domain/lecture';
import { User } from 'src/routes/users/domain/user';
export class Progress extends GeneralDomain {
  id: number;
  lecture: Lecture;
  user: User;
  completed: boolean;
}
