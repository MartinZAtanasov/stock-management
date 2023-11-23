import { Injectable } from '@nestjs/common';
import { CreateShipmentInput } from './dto/create-shipment.input';
import { UpdateShipmentInput } from './dto/update-shipment.input';
import { Shipment } from './entities/shipment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(input: CreateShipmentInput) {
    const {
      warehouse: warehouseId,
      product: productId,
      ...createShipmentInput
    } = input;

    const warehouse = await this.warehouseRepository.findOneByOrFail({
      id: warehouseId,
    });

    const product = await this.productRepository.findOneByOrFail({
      id: productId,
    });

    const shipment = new Shipment();
    shipment.warehouse = warehouse;
    shipment.product = product;

    const newShipment = this.shipmentRepository.create({
      ...shipment,
      ...createShipmentInput,
    });
    return this.shipmentRepository.save(newShipment);
  }

  findAll() {
    return this.shipmentRepository.find({
      relations: { warehouse: true, product: true },
    });
  }

  findOne(id: number) {
    return this.shipmentRepository.findOneOrFail({
      where: { id },
      relations: { warehouse: true, product: true },
    });
  }

  async update(input: UpdateShipmentInput) {
    const {
      warehouse: warehouseId,
      product: productId,
      ...updateShipmentInput
    } = input;

    const shipment = await this.shipmentRepository.findOneOrFail({
      where: { id: updateShipmentInput.id },
      relations: { product: true, warehouse: true },
    });

    if (warehouseId) {
      const warehouse = await this.warehouseRepository.findOneByOrFail({
        id: warehouseId,
      });
      shipment.warehouse = warehouse;
    }

    if (productId) {
      const product = await this.productRepository.findOneByOrFail({
        id: productId,
      });
      shipment.product = product;
    }

    return this.shipmentRepository.save({
      ...shipment,
      ...updateShipmentInput,
    });
  }

  async remove(id: number) {
    const shipment = await this.shipmentRepository.findOneOrFail({
      where: { id },
      relations: { warehouse: true, product: true },
    });
    await this.shipmentRepository.delete({ id });
    return shipment;
  }
}
