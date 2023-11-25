import { IsNumber } from 'class-validator';

export class DeductInput {
  @IsNumber()
  numberA: number;

  @IsNumber()
  numberB: number;
}
