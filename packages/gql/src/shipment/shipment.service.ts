import { Injectable } from '@nestjs/common';
import { CreateShipmentInput } from './dto/create-shipment.input';
import { Shipment, ShipmentType } from './entities/shipment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Product } from 'src/product/entities/product.entity';
import { ImportExportService } from './import-export-service';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private importExportService: ImportExportService,
  ) {}

  async create(input: CreateShipmentInput) {
    const {
      warehouse: warehouseId,
      product: productId,
      ...createShipmentInput
    } = input;

    return this.shipmentRepository.manager.transaction(async (manager) => {
      const shipmentRepository = manager.getRepository(Shipment);

      const warehouse = await this.warehouseRepository.findOneByOrFail({
        id: warehouseId,
      });

      const product = await this.productRepository.findOneByOrFail({
        id: productId,
      });

      if (createShipmentInput.type == ShipmentType.IMPORT) {
        await this.importExportService.handleImportShipment(
          input,
          warehouse,
          product,
          manager,
        );
      } else {
        await this.importExportService.handleExportShipment(
          input,
          warehouse,
          product,
          manager,
        );
      }

      const newShipment = shipmentRepository.create({
        ...new Shipment(),
        warehouse,
        product,
        ...createShipmentInput,
      });

      return shipmentRepository.save(newShipment);
    });
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
}
