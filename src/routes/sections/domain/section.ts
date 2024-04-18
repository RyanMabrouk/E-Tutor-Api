import { Course } from 'src/routes/courses/domain/course';
import { GeneralDomain } from '../../../shared/domain/general.domain';
export class Section extends GeneralDomain {
  id: number;
  name: string;
  course: Course;
}
