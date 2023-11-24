import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Product } from 'src/product/entities/product.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class WarehouseProduct {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int, { description: 'id of the warehouse product' })
  id: number;

  @Field(() => Int, { description: 'quantity of the warehouse product' })
  @Column('int')
  quantity: number;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.products, {
    onDelete: 'SET NULL',
  })
  @Field(() => Warehouse, { description: 'warehouse', nullable: true })
  warehouse?: Warehouse;

  @ManyToOne(() => Product, { onDelete: 'SET NULL' })
  @JoinColumn()
  @Field(() => Product, { description: 'product', nullable: true })
  product?: Product;
}
