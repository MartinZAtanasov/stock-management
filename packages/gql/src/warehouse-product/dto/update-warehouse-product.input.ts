import { CreateWarehouseProductInput } from './create-warehouse-product.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWarehouseProductInput extends PartialType(CreateWarehouseProductInput) {
  @Field(() => Int)
  id: number;
}
