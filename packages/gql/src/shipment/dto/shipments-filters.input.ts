import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsPositive,
  IsInt,
} from 'class-validator';
import { InputType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { ShipmentType } from '../entities/shipment.entity';

@InputType()
export class ShipmentsFilterInput {
  @IsOptional()
  @IsDate()
  @Field(() => GraphQLISODateTime, {
    description: 'from date shipments',
    nullable: true,
  })
  dateFrom: Date;

  @IsOptional()
  @IsDate()
  @Field(() => GraphQLISODateTime, {
    description: 'to date shipments',
    nullable: true,
  })
  dateTo: Date;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Field(() => Int, {
    description: 'the warehouse of the shipment',
    nullable: true,
  })
  warehouseId: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Field(() => Int, {
    description: 'the product of the shipment',
    nullable: true,
  })
  productId: number;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, {
    description: 'shipment has hazardous product',
    nullable: true,
  })
  hazardous: boolean;

  @IsOptional()
  @Field(() => ShipmentType, { description: 'shipment type', nullable: true })
  type: ShipmentType;
}
