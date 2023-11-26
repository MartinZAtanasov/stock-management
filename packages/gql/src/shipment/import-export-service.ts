import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateShipmentInput } from './dto/create-shipment.input';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { Product } from 'src/product/entities/product.entity';
import { WarehouseProduct } from 'src/warehouse-product/entities/warehouse-product.entity';
import { EntityManager } from 'typeorm';
import { CalculationsService } from 'src/shared/calculations.service';
import { UserInputError } from '@nestjs/apollo';

@Injectable()
export class ImportExportService {
  constructor(private calculationsService: CalculationsService) {}

  async handleImportShipment(
    createShipmentInput: CreateShipmentInput,
    warehouse: Warehouse,
    product: Product,
    manager: EntityManager,
  ) {
    const warehouseProductRepository = manager.getRepository(WarehouseProduct);
    const warehouseRepository = manager.getRepository(Warehouse);

    if (
      warehouse?.products?.length &&
      warehouse.hazardous != product.hazardous
    ) {
      throw new UserInputError(
        'Cannot mix hazardous and non hazardous products',
        {
          extensions: {
            code: HttpStatus.BAD_REQUEST,
            errors: [
              {
                data: { warehouseId: warehouse.id },
                code: HttpStatus.BAD_REQUEST,
              },
            ],
          },
        },
      );
    }

    const productSize = await this.calculationsService.calculateItemsSize({
      items: [
        { quantity: createShipmentInput.quantity, sizePerUnit: product.size },
      ],
    });

    if (productSize > warehouse.availableSize) {
      throw new UserInputError(
        'The Warehouse does not have enough available size',
        {
          extensions: {
            code: HttpStatus.BAD_REQUEST,
            errors: [
              {
                data: {
                  warehouseId: warehouse.id,
                  productSize,
                  warehouseAvailableSize: warehouse.availableSize,
                },
                code: HttpStatus.BAD_REQUEST,
              },
            ],
          },
        },
      );
    }

    let warehouseProduct = await warehouseProductRepository.findOne({
      where: { warehouse: { id: warehouse.id }, product: { id: product.id } },
    });

    if (!warehouseProduct) {
      warehouseProduct = warehouseProductRepository.create({
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

    const [availableSize, takenSize] = await Promise.all([
      this.calculationsService.deduct(warehouse.availableSize, productSize),
      this.calculationsService.sum([warehouse.takenSize, productSize]),
    ]);

    warehouse.hazardous = product.hazardous;
    warehouse.availableSize = availableSize;
    warehouse.takenSize = takenSize;

    await warehouseRepository.save(warehouse);

    return warehouseProductRepository.save(warehouseProduct);
  }

  async handleExportShipment(
    createShipmentInput: CreateShipmentInput,
    warehouse: Warehouse,
    product: Product,
    manager: EntityManager,
  ) {
    const warehouseProductRepository = manager.getRepository(WarehouseProduct);
    const warehouseRepository = manager.getRepository(Warehouse);

    const warehouseProduct = await warehouseProductRepository.findOneOrFail({
      where: { warehouse: { id: warehouse.id }, product: { id: product.id } },
    });

    if (warehouseProduct.quantity < createShipmentInput.quantity) {
      throw new UserInputError(
        'Export quantity is more than the warehouse product quantity',
        {
          extensions: {
            code: HttpStatus.BAD_REQUEST,
            errors: [
              {
                data: {
                  warehouseId: warehouse.id,
                  warehouseProductQuantity: warehouseProduct.quantity,
                  exportProductQuantity: createShipmentInput.quantity,
                },
                code: HttpStatus.BAD_REQUEST,
              },
            ],
          },
        },
      );
    }

    const [quantity, productSize] = await Promise.all([
      this.calculationsService.deduct(
        warehouseProduct.quantity,
        createShipmentInput.quantity,
      ),
      this.calculationsService.calculateItemsSize({
        items: [
          { quantity: createShipmentInput.quantity, sizePerUnit: product.size },
        ],
      }),
    ]);

    warehouseProduct.quantity = quantity;

    const [availableSize, takenSize] = await Promise.all([
      this.calculationsService.sum([warehouse.availableSize, productSize]),
      this.calculationsService.deduct(warehouse.takenSize, productSize),
    ]);

    warehouse.availableSize = availableSize;
    warehouse.takenSize = takenSize;

    if (warehouse.availableSize == warehouse.size) {
      warehouse.hazardous = false;
    }

    if (!warehouseProduct.quantity) {
      await warehouseProductRepository.delete({
        id: warehouseProduct.id,
      });
    } else {
      await warehouseProductRepository.save(warehouseProduct);
    }

    return warehouseRepository.save(warehouse);
  }
}
