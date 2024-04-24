import { PartialType } from '@nestjs/mapped-types';
import { CreateSectionDto } from './create-section.dto';
import { Exclude } from 'class-transformer';
import { Course } from 'src/routes/courses/domain/course';

export class UpdateSectionDto extends PartialType(CreateSectionDto) {
  @Exclude()
  course: Course;
}
