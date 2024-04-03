import { Allow, IsNotEmpty } from 'class-validator';

export class Tokens {
  @IsNotEmpty()
  token1: string;

  @Allow()
  token2?: string;
}
