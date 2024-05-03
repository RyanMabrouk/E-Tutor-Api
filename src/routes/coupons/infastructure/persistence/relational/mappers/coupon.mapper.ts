import { GeneralDomainKeysArray } from 'src/shared/domain/general.domain';

import { CouponEntity } from '../entities/coupon.entity';
import { omit } from 'lodash';
import { Coupon } from 'src/routes/coupons/domain/coupon';

export class CouponMapper {
  static toDomain(raw: CouponEntity): Coupon {
    const coupon = new Coupon();
    delete raw.__entity;
    Object.assign(coupon, raw);
    return omit(coupon, GeneralDomainKeysArray) as Coupon;
  }

  static toPersistence(entity: Coupon): CouponEntity {
    const couponEntity = new CouponEntity();
    Object.assign(couponEntity, entity);
    return couponEntity;
  }
}
