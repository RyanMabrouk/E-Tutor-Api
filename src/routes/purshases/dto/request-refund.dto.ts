import { IsString, IsOptional } from 'class-validator';

export class RefundPurshaseDto {
  @IsString()
  @IsOptional()
  paymentIntentId: string;
}
