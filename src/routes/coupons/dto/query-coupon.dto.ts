import { SortDto } from '../../../shared/dto/sort.dto';
import { QueryDto } from '../../../shared/dto/query.dto';
import { FindOptionsWhere } from 'typeorm';
import { CouponEntity } from '../infastructure/persistence/relational/entities/coupon.entity';
import { Coupon } from '../domain/coupon';

export type FilterCouponDto = FindOptionsWhere<CouponEntity>;

export class SortCouponDto extends SortDto<Coupon> {}

export class QueryCouponDto extends QueryDto<Coupon, FilterCouponDto> {}
