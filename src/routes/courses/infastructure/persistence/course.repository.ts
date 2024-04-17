import { Course } from '../../domain/course';
import { FilterCourseDto, SortCourseDto } from '../../dto/query-course.dto';
import { GeneralRepositoryType } from '../../../../shared/repositories/general.repository.type';

export abstract class CourseRepository extends GeneralRepositoryType<
  Course,
  FilterCourseDto,
  SortCourseDto,
  Course['id']
> {}
