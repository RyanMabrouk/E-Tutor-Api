import { Module } from '@nestjs/common';
import { RelationalPurshasePersistenceModule } from './infastructure/persistence/relational/relational-persistence.module';
import { PurshasesController } from './purshases.controller';
import { PurshasesService } from './purshases.service';
import { CourseModule } from '../courses/course.module';
import { UsersModule } from '../users/users.module';
import { CouponsModule } from '../coupons/coupons.module';
const infrastructurePersistenceModule = RelationalPurshasePersistenceModule;
@Module({
  imports: [
    infrastructurePersistenceModule,
    CourseModule,
    UsersModule,
    CouponsModule,
  ],
  controllers: [PurshasesController],
  providers: [PurshasesService],
  exports: [PurshasesService, infrastructurePersistenceModule],
})
export class PurshaseModule {}
