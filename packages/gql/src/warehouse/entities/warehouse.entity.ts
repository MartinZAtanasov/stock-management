import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Shipment } from 'src/shipment/entities/shipment.entity';
import { WarehouseProduct } from 'src/warehouse-product/entities/warehouse-product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Warehouse {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int, { description: 'id of the warehouse' })
  id: number;

  @Column({ unique: true })
  @Field(() => String, { description: 'name of the warehouse' })
  name: string;

  @Column('int')
  @Field(() => Int, { description: 'size capacity of the warehouse' })
  size: number;

  @OneToMany(() => Shipment, (shipment) => shipment.warehouse)
  @Field(() => [Shipment], { description: 'size capacity of the warehouse' })
  shipments: Shipment[];

  @Column('int', { default: 0 })
  @Field(() => Int, { description: 'available size of the warehouse' })
  availableSize: number;

  @Column('int', { default: 0 })
  @Field(() => Int, { description: 'taken size of the warehouse' })
  takenSize: number;

  @OneToMany(
    () => WarehouseProduct,
    (warehouseProduct) => warehouseProduct.warehouse,
  )
  @Field(() => [WarehouseProduct], {
    description: 'stocked products in the warehouse',
  })
  products: WarehouseProduct[];

  @Column('boolean', { default: false })
  @Field(() => Boolean, { description: 'is product hazardous' })
  hazardous: boolean;
}
