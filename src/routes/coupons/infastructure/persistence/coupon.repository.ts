import { Coupon } from '../../domain/coupon';
import { FilterCouponDto, SortCouponDto } from '../../dto/query-coupon.dto';
import { GeneralRepositoryType } from '../../../../shared/repositories/general.repository.type';

export abstract class CouponRepository extends GeneralRepositoryType<
  Coupon,
  FilterCouponDto,
  SortCouponDto,
  Coupon['id']
> {}
