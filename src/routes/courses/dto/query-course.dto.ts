import { SortDto } from 'src/shared/dto/sort.dto';
import { QueryDto } from 'src/shared/dto/query.dto';
import { FindOptionsWhere } from 'typeorm';
import { Course } from '../domain/course';
import { CourseEntity } from '../infastructure/persistence/relational/entities/course.entity';

export type FilterCourseDto = FindOptionsWhere<CourseEntity>;

export class SortCourseDto extends SortDto<Course> {}

export class QueryCourseDto extends QueryDto<Course, FilterCourseDto> {}
