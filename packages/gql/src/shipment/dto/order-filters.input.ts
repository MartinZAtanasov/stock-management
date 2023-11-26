import { IsOptional } from 'class-validator';
import { InputType, Field, registerEnumType } from '@nestjs/graphql';

enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(OrderDirection, {
  name: 'OrderDirection',
});

@InputType()
export class ShipmentsOrderInput {
  @IsOptional()
  @Field(() => OrderDirection, { description: 'order by date', nullable: true })
  date: OrderDirection;
}
