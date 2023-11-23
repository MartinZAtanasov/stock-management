import { CreateShipmentInput } from './create-shipment.input';
import {
  InputType,
  Field,
  Int,
  PartialType,
  GraphQLISODateTime,
} from '@nestjs/graphql';

@InputType()
export class UpdateShipmentInput extends PartialType(CreateShipmentInput) {
  @Field(() => GraphQLISODateTime, {
    description: 'timestamp of the shipment',
    nullable: true,
  })
  date?: Date;

  @Field(() => Int, { description: 'id of the shipment' })
  id: number;
}
