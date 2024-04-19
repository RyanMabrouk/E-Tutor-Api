import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurshaseEntity } from './entities/purshase';
import { PurshaseRepository } from '../purshase.repository';
import { PurshaseRelationalRepository } from './repositories/purshase.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PurshaseEntity])],
  providers: [
    {
      provide: PurshaseRepository,
      useClass: PurshaseRelationalRepository,
    },
  ],
  exports: [PurshaseRepository],
})
export class RelationalPurshasePersistenceModule {}
