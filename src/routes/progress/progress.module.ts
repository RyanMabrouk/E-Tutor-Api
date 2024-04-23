import { Module } from '@nestjs/common';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { RelationalSectionPersistenceModule } from './infastructure/persistence/relational/relational-persistence.module';
// import { CourseModule } from '../courses/course.module';
import { LectureModule } from '../lectures/lecture.module';
import { UsersModule } from '../users/users.module';
const infrastructurePersistenceModule = RelationalSectionPersistenceModule;
@Module({
  imports: [infrastructurePersistenceModule, LectureModule, UsersModule],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService, infrastructurePersistenceModule],
})
export class ProgressModule {}
