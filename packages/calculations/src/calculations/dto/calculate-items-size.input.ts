import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { IsInt, IsPositive } from 'class-validator';

export class ItemInput {
  @IsInt()
  @IsPositive()
  quantity: number;

  @IsInt()
  @IsPositive()
  sizePerUnit: number;
}

export class CalculateItemsSizeInput {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemInput)
  items: ItemInput[];
}
