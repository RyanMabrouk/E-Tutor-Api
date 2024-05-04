import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class ConfirmGiftPurshaseDto {
  @IsString()
  @IsOptional()
  paymentIntentId: string;

  @IsNotEmpty()
  card: any;

  @IsNumber()
  @IsNotEmpty()
  recieverId: number;
}
