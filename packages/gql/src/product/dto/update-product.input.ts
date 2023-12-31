import { IsInt, IsPositive } from 'class-validator';
import { CreateProductInput } from './create-product.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @IsInt()
  @IsPositive()
  @Field(() => Int, { description: 'id of the product' })
  id: number;
}
