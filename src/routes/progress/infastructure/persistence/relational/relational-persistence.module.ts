import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressEntity } from './entities/progress.entity';
import { ProgressRepository } from '../section.repository';
import { ProgressRelationalRepository } from './repositories/progress.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProgressEntity])],
  providers: [
    {
      provide: ProgressRepository,
      useClass: ProgressRelationalRepository,
    },
  ],
  exports: [ProgressRepository],
})
export class RelationalSectionPersistenceModule {}
