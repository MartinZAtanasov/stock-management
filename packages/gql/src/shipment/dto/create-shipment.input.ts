import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateShipmentInput {
  @Field(() => Int, { description: 'warehouse id' })
  warehouse: number;
}
