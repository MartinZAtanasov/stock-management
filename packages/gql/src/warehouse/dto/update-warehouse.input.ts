import { IsInt, IsPositive } from 'class-validator';
import { CreateWarehouseInput } from './create-warehouse.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWarehouseInput extends PartialType(CreateWarehouseInput) {
  @IsInt()
  @IsPositive()
  @Field(() => Int, { description: 'id of the warehouse' })
  id: number;
}
