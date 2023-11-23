import { IsInt, IsPositive } from 'class-validator';

export class ItemDto {
  @IsInt()
  @IsPositive()
  quantity: number;

  @IsInt()
  @IsPositive()
  sizePerUnit: number;
}
