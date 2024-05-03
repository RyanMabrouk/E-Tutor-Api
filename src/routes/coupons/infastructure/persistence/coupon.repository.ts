import { Coupon } from '../../domain/coupon';
import { FilterCouponDto, SortCouponDto } from '../../dto/query-coupon.dto';
import { GeneralRepositoryType } from '../../../../shared/repositories/general.repository.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { FindOneOptions } from 'typeorm';
import { CouponEntity } from './relational/entities/coupon.entity';

export abstract class CouponRepository extends GeneralRepositoryType<
  Coupon,
  FilterCouponDto,
  SortCouponDto,
  Coupon['id']
> {
  abstract findOneOrNull(
    fields: EntityCondition<Coupon>,
    relations?: FindOneOptions<CouponEntity>['relations'],
  ): Promise<Coupon | null>;
}
