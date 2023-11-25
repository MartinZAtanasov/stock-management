import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from './entities/warehouse.entity';
import { WarehousesFilterInput } from './dto/warehouses-filter.input';

@Resolver(() => Warehouse)
export class WarehouseResolver {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Query(() => [Warehouse], { name: 'warehouses' })
  findAll(
    @Args('warehousesFilterInput', { nullable: true })
    warehousesFilterInput?: WarehousesFilterInput,
  ) {
    return this.warehouseService.findAll(warehousesFilterInput);
  }

  @Query(() => Warehouse, { name: 'warehouse' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.warehouseService.findOne(id);
  }
}
