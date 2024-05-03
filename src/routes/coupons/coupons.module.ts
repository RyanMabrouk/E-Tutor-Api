import { Module } from '@nestjs/common';
import { RelationalCouponPersistenceModule } from './infastructure/persistence/relational/relational-persistence.module';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';
const infrastructurePersistenceModule = RelationalCouponPersistenceModule;
@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [CouponsController],
  providers: [CouponsService],
  exports: [CouponsService, infrastructurePersistenceModule],
})
export class CouponsModule {}
