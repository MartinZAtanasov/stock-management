import { Module } from '@nestjs/common';
import { WarehouseProduct } from './entities/warehouse-product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseProduct])],
})
export class WarehouseProductModule {}
