import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { ItemInput } from './item';

export class CalculateSizeAvailabilityInput {
  @IsInt()
  @IsPositive()
  size: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemInput)
  items: ItemInput[];
}
