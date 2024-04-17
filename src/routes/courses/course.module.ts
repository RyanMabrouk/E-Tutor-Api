import { Module } from '@nestjs/common';
import { RelationalCoursePersistenceModule } from './infastructure/persistence/relational/relational-persistence.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { FilesModule } from '../files/files.module';
import { CategoryModule } from '../categories/categories.module';
import { SubcategoryModule } from '../subcategories/subcategories.module';
import { LanguageModule } from '../languages/language.module';
import { UsersModule } from '../users/users.module';
const infrastructurePersistenceModule = RelationalCoursePersistenceModule;
@Module({
  imports: [
    infrastructurePersistenceModule,
    FilesModule,
    CategoryModule,
    SubcategoryModule,
    LanguageModule,
    UsersModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService, infrastructurePersistenceModule],
})
export class CourseModule {}
