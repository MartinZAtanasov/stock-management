import { Module } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { ShipmentResolver } from './shipment.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipment } from './entities/shipment.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Product } from 'src/product/entities/product.entity';
import { CalculationsService } from 'src/shared/calculations.service';
import { ImportExportService } from './import-export-service';

@Module({
  imports: [TypeOrmModule.forFeature([Shipment, Warehouse, Product])],
  providers: [
    ShipmentResolver,
    ShipmentService,
    CalculationsService,
    ImportExportService,
  ],
})
export class ShipmentModule {}
