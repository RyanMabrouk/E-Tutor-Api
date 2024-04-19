import { Course } from 'src/routes/courses/domain/course';
import { GeneralDomain } from '../../../shared/domain/general.domain';

export class Purshase extends GeneralDomain {
  id: number;
  discount: number;
  courses: Course[];
}
