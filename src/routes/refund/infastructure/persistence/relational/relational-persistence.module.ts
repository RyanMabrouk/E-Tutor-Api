import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefundEntity } from './entities/refund.entity';
import { RefundRepository } from '../refund.repository';
import { RefundRelationalRepository } from './repositories/refund.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RefundEntity])],
  providers: [
    {
      provide: RefundRepository,
      useClass: RefundRelationalRepository,
    },
  ],
  exports: [RefundRepository],
})
export class RelationalRefundsPersistenceModule {}
