import { Course } from 'src/routes/courses/domain/course';
import { User } from 'src/routes/users/domain/user';
import { GeneralDomain } from 'src/shared/domain/general.domain';

export class Review extends GeneralDomain {
  id: number;
  content: string;
  course: Course;
  user: User;
  rating: number;
}
