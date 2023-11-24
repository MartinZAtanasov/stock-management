import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsPositive, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateWarehouseInput {
  @IsString()
  @MinLength(2)
  @Field(() => String, { description: 'name of the warehouse' })
  name: string;

  @IsInt()
  @IsPositive()
  @Field(() => Int, { description: 'size of the warehouse' })
  size: number;
}
