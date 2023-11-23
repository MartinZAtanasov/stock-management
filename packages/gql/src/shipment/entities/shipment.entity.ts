import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Shipment {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int, { description: 'id of the shipment' })
  id: number;

  @Field(() => GraphQLISODateTime, { description: 'timestamp of the shipment' })
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.shipments)
  @Field(() => Warehouse, { description: 'warehouse' })
  warehouse: Warehouse;

  // products & amount
}
