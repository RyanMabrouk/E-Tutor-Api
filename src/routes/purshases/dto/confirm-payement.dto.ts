import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class ConfirmPurshaseDto {
  @IsString()
  @IsOptional()
  paymentIntentId: string;

  @IsNotEmpty()
  card: any;
}
