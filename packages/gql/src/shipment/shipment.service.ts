import { Injectable } from '@nestjs/common';
import { CreateShipmentInput } from './dto/create-shipment.input';
import { UpdateShipmentInput } from './dto/update-shipment.input';
import { Shipment } from './entities/shipment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  async create(input: CreateShipmentInput) {
    const { warehouse: warehouseId, ...createShipmentInput } = input;

    const warehouse = await this.warehouseRepository.findOneBy({
      id: warehouseId,
    });

    const shipment = new Shipment();
    shipment.warehouse = warehouse;

    const newShipment = this.shipmentRepository.create({
      ...shipment,
      ...createShipmentInput,
    });
    return this.shipmentRepository.save(newShipment);
  }

  findAll() {
    return this.shipmentRepository.find({
      relations: { warehouse: true },
    });
  }

  findOne(id: number) {
    return this.shipmentRepository.findOneBy({ id });
  }

  async update(input: UpdateShipmentInput) {
    const { warehouse: warehouseId, ...updateShipmentInput } = input;

    const shipment = await this.shipmentRepository.findOneBy({
      id: updateShipmentInput.id,
    });

    if (warehouseId) {
      const warehouse = await this.warehouseRepository.findOneBy({
        id: warehouseId,
      });
      shipment.warehouse = warehouse;
    }

    return this.shipmentRepository.save({
      ...shipment,
      ...updateShipmentInput,
    });
  }

  remove(id: number) {
    return this.shipmentRepository.delete({ id });
  }
}
