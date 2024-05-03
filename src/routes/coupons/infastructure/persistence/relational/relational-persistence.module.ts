import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponEntity } from './entities/coupon.entity';
import { CouponRepository } from '../coupon.repository';
import { CouponRelationalRepository } from './repositories/coupon.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CouponEntity])],
  providers: [
    {
      provide: CouponRepository,
      useClass: CouponRelationalRepository,
    },
  ],
  exports: [CouponRepository],
})
export class RelationalCouponPersistenceModule {}
