import { Module } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { ShipmentResolver } from './shipment.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipment } from './entities/shipment.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Product } from 'src/product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shipment, Warehouse, Product])],
  providers: [ShipmentResolver, ShipmentService],
})
export class ShipmentModule {}
