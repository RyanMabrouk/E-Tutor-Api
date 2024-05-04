import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class ConfirmPurshaseDto {
  @IsString()
  @IsOptional()
  clientSecret: string;

  @IsNotEmpty()
  card: any;
}
