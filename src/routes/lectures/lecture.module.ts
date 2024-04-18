import { Module } from '@nestjs/common';
import { RelationalLecturePersistenceModule } from './infastructure/persistence/relational/relational-persistence.module';
import { LectureController } from './lecture.controller';
import { LectureService } from './lecture.service';
import { SectionModule } from '../sections/section.module';
import { FilesModule } from '../files/files.module';
const infrastructurePersistenceModule = RelationalLecturePersistenceModule;
@Module({
  imports: [infrastructurePersistenceModule, SectionModule, FilesModule],
  controllers: [LectureController],
  providers: [LectureService],
  exports: [LectureService, infrastructurePersistenceModule],
})
export class LectureModule {}
