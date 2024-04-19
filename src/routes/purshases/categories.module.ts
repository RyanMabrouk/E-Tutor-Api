import { Module } from '@nestjs/common';
import { RelationalPurshasePersistenceModule } from './infastructure/persistence/relational/relational-persistence.module';
import { PurshasesController } from './purshases.controller';
import { PurshasesService } from './purshases.service';
const infrastructurePersistenceModule = RelationalPurshasePersistenceModule;
@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [PurshasesController],
  providers: [PurshasesService],
  exports: [PurshasesService, infrastructurePersistenceModule],
})
export class PurshaseModule {}
