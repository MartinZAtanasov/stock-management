import { InputType, Int, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateProductInput {
  @IsString()
  @MinLength(2)
  @Field(() => String, { description: 'name of the warehouse' })
  name: string;

  @IsInt()
  @IsPositive()
  @Field(() => Int, { description: 'size of the product per unit' })
  size: number;

  @IsBoolean()
  @Field(() => Boolean, { description: 'is product hazardous' })
  hazardous: boolean;
}
