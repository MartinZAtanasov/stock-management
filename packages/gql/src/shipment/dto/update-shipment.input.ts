import { IsInt, IsPositive } from 'class-validator';
import { CreateShipmentInput } from './create-shipment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateShipmentInput extends PartialType(CreateShipmentInput) {
  @IsInt()
  @IsPositive()
  @Field(() => Int, { description: 'id of the shipment' })
  id: number;
}
