import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseResolver } from './warehouse.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse])],
  providers: [WarehouseResolver, WarehouseService],
})
export class WarehouseModule {}
