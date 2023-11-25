import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';

export class SumInput {
  @IsArray()
  @ArrayMinSize(2)
  @IsNumber({}, { each: true })
  numbers: number[];
}
