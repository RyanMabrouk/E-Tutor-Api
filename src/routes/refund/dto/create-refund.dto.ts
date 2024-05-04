import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { GeneralDomainKeysWithId } from 'src/shared/domain/general.domain';
import { Refund } from '../domain/refund';

export class CreateRefundDto implements Omit<Refund, GeneralDomainKeysWithId> {
  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsNotEmpty()
  intentPaymentId: string;
}
