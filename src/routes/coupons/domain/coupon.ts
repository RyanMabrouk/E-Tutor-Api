import { GeneralDomain } from '../../../shared/domain/general.domain';

export class Coupon extends GeneralDomain {
  id: number;
  expiryDate: Date;
  value: number;
  numberOfUses: number;
  code: string;
}
