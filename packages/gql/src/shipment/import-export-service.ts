import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateShipmentInput } from './dto/create-shipment.input';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Product } from 'src/product/entities/product.entity';
import { WarehouseProduct } from 'src/warehouse-product/entities/warehouse-product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalculationsService } from 'src/shared/calculations.service';
import { CustomHttpException } from 'src/exceptions/custom-http.exception';

@Injectable()
export class ImportExportService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    @InjectRepository(WarehouseProduct)
    private warehouseProductRepository: Repository<WarehouseProduct>,
    private calculationsService: CalculationsService,
  ) {}

  async handleImportShipment(
    createShipmentInput: CreateShipmentInput,
    warehouse: Warehouse,
    product: Product,
  ) {
    if (
      warehouse?.products?.length &&
      warehouse.hazardous !== product.hazardous
    ) {
      throw new CustomHttpException(
        null,
        HttpStatus.CONFLICT,
        'Cannot mix hazardous and non hazardous products in the warehouse',
      );
    }

    const productSize = await this.calculationsService.calculateItemsSize({
      items: [
        { quantity: createShipmentInput.quantity, sizePerUnit: product.size },
      ],
    });

    if (productSize > warehouse.availableSize) {
      throw new CustomHttpException(
        null,
        HttpStatus.CONFLICT,
        'Not enough available size in the warehouse',
      );
    }

    let warehouseProduct = await this.warehouseProductRepository.findOne({
      where: { warehouse: { id: warehouse.id }, product: { id: product.id } },
    });

    if (!warehouseProduct) {
      warehouseProduct = this.warehouseProductRepository.create({
        ...new WarehouseProduct(),
        quantity: createShipmentInput.quantity,
        product,
        warehouse,
      });
    } else {
      warehouseProduct.quantity = await this.calculationsService.sum([
        warehouseProduct.quantity,
        createShipmentInput.quantity,
      ]);
    }

    warehouse.hazardous = product.hazardous;
    warehouse.availableSize = await this.calculationsService.deduct(
      warehouse.availableSize,
      productSize,
    );
    warehouse.takenSize = await this.calculationsService.sum([
      warehouse.takenSize,
      productSize,
    ]);

    await this.warehouseRepository.save(warehouse);

    return this.warehouseProductRepository.save(warehouseProduct);
  }

  async handleExportShipment(
    createShipmentInput: CreateShipmentInput,
    warehouse: Warehouse,
    product: Product,
  ) {
    const warehouseProduct =
      await this.warehouseProductRepository.findOneOrFail({
        where: { warehouse: { id: warehouse.id }, product: { id: product.id } },
      });

    if (warehouseProduct.quantity < createShipmentInput.quantity) {
      throw new CustomHttpException(
        null,
        HttpStatus.CONFLICT,
        'Export quantity is more than the warehouse product quantity',
      );
    }

    warehouseProduct.quantity = await this.calculationsService.deduct(
      warehouseProduct.quantity,
      createShipmentInput.quantity,
    );

    const productSize = await this.calculationsService.calculateItemsSize({
      items: [
        { quantity: createShipmentInput.quantity, sizePerUnit: product.size },
      ],
    });

    warehouse.availableSize = await this.calculationsService.sum([
      warehouse.availableSize,
      productSize,
    ]);

    warehouse.takenSize = await this.calculationsService.deduct(
      warehouse.takenSize,
      productSize,
    );

    if (!warehouseProduct.quantity) {
      warehouse.hazardous = false;

      await this.warehouseProductRepository.delete({
        id: warehouseProduct.id,
      });
    } else {
      await this.warehouseProductRepository.save(warehouseProduct);
    }

    return this.warehouseRepository.save(warehouse);
  }
}
