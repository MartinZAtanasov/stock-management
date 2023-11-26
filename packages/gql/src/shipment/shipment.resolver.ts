import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ShipmentService } from './shipment.service';
import { Shipment } from './entities/shipment.entity';
import { CreateShipmentInput } from './dto/create-shipment.input';
import { ShipmentsFilterInput } from './dto/shipments-filters.input';

@Resolver(() => Shipment)
export class ShipmentResolver {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Mutation(() => Shipment)
  createShipment(
    @Args('createShipmentInput') createShipmentInput: CreateShipmentInput,
  ) {
    return this.shipmentService.create(createShipmentInput);
  }

  @Query(() => [Shipment], { name: 'shipments' })
  findAll(
    @Args('shipmentsFilterInput', { nullable: true })
    shipmentsFilterInput: ShipmentsFilterInput,
  ) {
    return this.shipmentService.findAll(shipmentsFilterInput);
  }

  @Query(() => Shipment, { name: 'shipment' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.shipmentService.findOne(id);
  }
}
