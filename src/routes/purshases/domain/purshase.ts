import { Course } from 'src/routes/courses/domain/course';
import { GeneralDomain } from '../../../shared/domain/general.domain';
import { User } from 'src/routes/users/domain/user';

export class Purshase extends GeneralDomain {
  id: number;
  discount: number;
  totalPrice: number;
  courses: Course[];
  user: User;
}
