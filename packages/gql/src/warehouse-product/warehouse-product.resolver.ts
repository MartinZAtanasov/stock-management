import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WarehouseProductService } from './warehouse-product.service';
import { WarehouseProduct } from './entities/warehouse-product.entity';
import { CreateWarehouseProductInput } from './dto/create-warehouse-product.input';
import { UpdateWarehouseProductInput } from './dto/update-warehouse-product.input';

@Resolver(() => WarehouseProduct)
export class WarehouseProductResolver {
  constructor(
    private readonly warehouseProductService: WarehouseProductService,
  ) {}

  @Mutation(() => WarehouseProduct)
  createWarehouseProduct(
    @Args('createWarehouseProductInput')
    createWarehouseProductInput: CreateWarehouseProductInput,
  ) {
    return this.warehouseProductService.create(createWarehouseProductInput);
  }

  @Query(() => [WarehouseProduct], { name: 'warehouseProduct' })
  findAll() {
    return this.warehouseProductService.findAll();
  }

  @Query(() => WarehouseProduct, { name: 'warehouseProduct' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.warehouseProductService.findOne(id);
  }

  @Mutation(() => WarehouseProduct)
  updateWarehouseProduct(
    @Args('updateWarehouseProductInput')
    updateWarehouseProductInput: UpdateWarehouseProductInput,
  ) {
    return this.warehouseProductService.update(
      updateWarehouseProductInput.id,
      updateWarehouseProductInput,
    );
  }

  @Mutation(() => WarehouseProduct)
  removeWarehouseProduct(@Args('id', { type: () => Int }) id: number) {
    return this.warehouseProductService.remove(id);
  }
}
