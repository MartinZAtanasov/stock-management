import { CreateWarehouseInput } from './create-warehouse.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWarehouseInput extends PartialType(CreateWarehouseInput) {
  @Field(() => String, { description: 'name of the warehouse' })
  name: string;

  @Field(() => Int, { description: 'size of the warehouse' })
  size: number;

  @Field(() => Int, { description: 'id of the warehouse' })
  id: number;
}
