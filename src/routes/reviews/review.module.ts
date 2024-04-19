import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import databaseConfig from 'src/database/config/database.config';
import { DatabaseConfig } from 'src/database/config/database-config.type';
import { RelationalReviewPersistenceModule } from './infastructure/persistence/relational/relational-persistence.module';
import { CourseModule } from '../courses/course.module';
const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? class DocumentReviewPersistenceModule {}
  : RelationalReviewPersistenceModule;
@Module({
  imports: [infrastructurePersistenceModule, CourseModule],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService, infrastructurePersistenceModule],
})
export class ReviewModule {}
