import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from './entities/warehouse.entity';
import { CreateWarehouseInput } from './dto/create-warehouse.input';
import { UpdateWarehouseInput } from './dto/update-warehouse.input';

@Resolver(() => Warehouse)
export class WarehouseResolver {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Mutation(() => Warehouse)
  createWarehouse(
    @Args('createWarehouseInput') createWarehouseInput: CreateWarehouseInput,
  ) {
    return this.warehouseService.create(createWarehouseInput);
  }

  @Query(() => [Warehouse], { name: 'warehouses' })
  findAll() {
    return this.warehouseService.findAll();
  }

  @Query(() => Warehouse, { name: 'warehouse' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.warehouseService.findOne(id);
  }

  @Mutation(() => Warehouse)
  updateWarehouse(
    @Args('updateWarehouseInput') updateWarehouseInput: UpdateWarehouseInput,
  ) {
    return this.warehouseService.update(updateWarehouseInput);
  }

  @Mutation(() => Warehouse)
  removeWarehouse(@Args('id', { type: () => Int }) id: number) {
    return this.warehouseService.remove(id);
  }
}
