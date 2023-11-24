import { InputType, Int, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { ShipmentType } from '../entities/shipment.entity';
import { IsDate, IsEnum, IsInt, IsPositive } from 'class-validator';

@InputType()
export class CreateShipmentInput {
  @IsInt()
  @IsPositive()
  @Field(() => Int, { description: 'warehouse id' })
  warehouse: number;

  @IsInt()
  @IsPositive()
  @Field(() => Int, { description: 'product id' })
  product: number;

  @IsInt()
  @IsPositive()
  @Field(() => Int, { description: 'product quantity' })
  quantity: number;

  @IsEnum(ShipmentType)
  @Field(() => ShipmentType, { description: 'shipment type' })
  type: ShipmentType;

  @IsDate()
  @Field(() => GraphQLISODateTime, {
    description: 'timestamp of the shipment',
    nullable: true,
  })
  date?: Date;
}
