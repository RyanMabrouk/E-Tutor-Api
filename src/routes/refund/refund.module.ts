import { Module } from '@nestjs/common';
import { RelationalRefundsPersistenceModule } from './infastructure/persistence/relational/relational-persistence.module';
import { RefundsController } from './refund.controller';
import { RefundsService } from './refund.service';
import { PurshaseModule } from '../purshases/purshases.module';
const infrastructurePersistenceModule = RelationalRefundsPersistenceModule;
@Module({
  imports: [infrastructurePersistenceModule, PurshaseModule],
  controllers: [RefundsController],
  providers: [RefundsService],
  exports: [RefundsService, infrastructurePersistenceModule],
})
export class RefundsModule {}
