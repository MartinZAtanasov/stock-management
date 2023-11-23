import { InputType, Int, Field } from '@nestjs/graphql';
import { ShipmentType } from '../entities/shipment.entity';

@InputType()
export class CreateShipmentInput {
  @Field(() => Int, { description: 'warehouse id' })
  warehouse: number;

  @Field(() => Int, { description: 'product id' })
  product: number;

  @Field(() => Int, { description: 'product quantity' })
  quantity: number;

  @Field(() => ShipmentType, { description: 'shipment type' })
  type: ShipmentType;
}
