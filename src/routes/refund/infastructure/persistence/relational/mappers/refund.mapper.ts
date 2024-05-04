import { GeneralDomainKeysArray } from 'src/shared/domain/general.domain';
import { RefundEntity } from '../entities/refund.entity';
import { omit } from 'lodash';
import { Refund } from 'src/routes/refund/domain/refund';

export class RefundMapper {
  static toDomain(raw: RefundEntity): Refund {
    const refund = new Refund();
    delete raw.__entity;
    Object.assign(refund, raw);
    return omit(refund, GeneralDomainKeysArray) as Refund;
  }

  static toPersistence(entity: Refund): RefundEntity {
    const refundEntity = new RefundEntity();
    Object.assign(refundEntity, entity);
    return refundEntity;
  }
}
