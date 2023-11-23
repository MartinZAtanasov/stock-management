import { CreateWarehouseInput } from './create-warehouse.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWarehouseInput extends PartialType(CreateWarehouseInput) {
  @Field(() => Int, { description: 'id of the warehouse' })
  id: number;
}
