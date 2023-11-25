import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from './entities/warehouse.entity';

@Resolver(() => Warehouse)
export class WarehouseResolver {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Query(() => [Warehouse], { name: 'warehouses' })
  findAll() {
    return this.warehouseService.findAll();
  }

  @Query(() => Warehouse, { name: 'warehouse' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.warehouseService.findOne(id);
  }
}
