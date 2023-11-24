import { IsInt, IsPositive } from 'class-validator';

export class ItemInput {
  @IsInt()
  @IsPositive()
  quantity: number;

  @IsInt()
  @IsPositive()
  sizePerUnit: number;
}
