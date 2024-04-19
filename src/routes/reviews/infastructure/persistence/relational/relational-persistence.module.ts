import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { ReviewRepository } from '../review.repository';
import { ReviewRelationalRepository } from './repositories/review.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity])],
  providers: [
    {
      provide: ReviewRepository,
      useClass: ReviewRelationalRepository,
    },
  ],
  exports: [ReviewRepository],
})
export class RelationalReviewPersistenceModule {}
