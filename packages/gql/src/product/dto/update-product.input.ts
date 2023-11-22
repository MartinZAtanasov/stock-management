import { CreateProductInput } from './create-product.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @Field(() => Int, { description: 'id of the product' })
  id: number;

  @Field(() => String, { description: 'name of the warehouse' })
  name: string;

  @Field(() => Int, { description: 'size of the product per unit' })
  size: number;

  @Field(() => Boolean, { description: 'is product hazardous' })
  hazardous: boolean;
}
