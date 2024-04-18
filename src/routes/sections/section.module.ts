import { Module } from '@nestjs/common';
import { SectionController } from './section.controller';
import { SectionService } from './section.service';
import { RelationalSectionPersistenceModule } from './infastructure/persistence/relational/relational-persistence.module';
import { CourseModule } from '../courses/course.module';
const infrastructurePersistenceModule = RelationalSectionPersistenceModule;
@Module({
  imports: [infrastructurePersistenceModule, CourseModule],
  controllers: [SectionController],
  providers: [SectionService],
  exports: [SectionService, infrastructurePersistenceModule],
})
export class SectionModule {}
