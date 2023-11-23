import {
  ObjectType,
  Field,
  Int,
  GraphQLISODateTime,
  registerEnumType,
} from '@nestjs/graphql';
import { Product } from 'src/product/entities/product.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ShipmentType {
  EXPORT = 'export',
  IMPORT = 'import',
}

registerEnumType(ShipmentType, {
  name: 'ShipmentType',
});

@Entity()
@ObjectType()
export class Shipment {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int, { description: 'id of the shipment' })
  id: number;

  @Field(() => GraphQLISODateTime, { description: 'timestamp of the shipment' })
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.shipments, {
    onDelete: 'SET NULL',
  })
  @Field(() => Warehouse, { description: 'warehouse' })
  warehouse: Warehouse;

  @Field(() => ShipmentType, { description: 'shipment type' })
  @Column({
    type: 'enum',
    enum: ShipmentType,
  })
  type: ShipmentType;

  @Field(() => Int, { description: 'quantity of the product' })
  @Column('int')
  quantity: number;

  @ManyToOne(() => Product, { onDelete: 'SET NULL' })
  @JoinColumn()
  @Field(() => Product, { description: 'product' })
  product: Product;
}
