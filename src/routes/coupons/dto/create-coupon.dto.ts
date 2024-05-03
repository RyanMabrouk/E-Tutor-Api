import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { GeneralDomainKeysWithId } from 'src/shared/domain/general.domain';
import { Coupon } from '../domain/coupon';

export class CreateCouponDto implements Omit<Coupon, GeneralDomainKeysWithId> {
  @IsNotEmpty()
  expiryDate: Date;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @IsNotEmpty()
  numberOfUses: number;
}
