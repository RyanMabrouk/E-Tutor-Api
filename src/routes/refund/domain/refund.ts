import { GeneralDomain } from '../../../shared/domain/general.domain';

export class Refund extends GeneralDomain {
  id: number;
  intentPaymentId: string;
  reason?: string;
}
