import { Course } from 'src/routes/courses/domain/course';
import { User } from 'src/routes/users/domain/user';
import { GeneralDomain } from 'src/shared/domain/general.domain';

export class Wishlist extends GeneralDomain {
  id: number;
  user: User;
  courses?: Course[];
}
