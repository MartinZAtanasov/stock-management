import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateWarehouseInput {
  @Field(() => String, { description: 'name of the warehouse' })
  name: string;

  @Field(() => Int, { description: 'size of the warehouse' })
  size: number;
}
