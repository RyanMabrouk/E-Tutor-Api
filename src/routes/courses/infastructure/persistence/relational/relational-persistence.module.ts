import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from './entities/course.entity';
import { CourseRepository } from '../course.repository';
import { CourseRelationalRepository } from './repositories/course.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity])],
  providers: [
    {
      provide: CourseRepository,
      useClass: CourseRelationalRepository,
    },
  ],
  exports: [CourseRepository],
})
export class RelationalCoursePersistenceModule {}
