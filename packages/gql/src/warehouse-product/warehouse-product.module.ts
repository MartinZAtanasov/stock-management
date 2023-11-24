import { Module } from '@nestjs/common';
import { WarehouseProductService } from './warehouse-product.service';
import { WarehouseProductResolver } from './warehouse-product.resolver';
import { WarehouseProduct } from './entities/warehouse-product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseProduct])],
  providers: [WarehouseProductResolver, WarehouseProductService],
})
export class WarehouseProductModule {}
