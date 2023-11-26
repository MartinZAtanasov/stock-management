import { BadRequestException, Injectable } from '@nestjs/common';
import { CalculationsService } from 'src/shared/calculations.service';
import { WarehouseProduct } from 'src/warehouse-product/entities/warehouse-product.entity';
import { EntityManager } from 'typeorm';
import { Product } from './entities/product.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { UpdateProductInput } from './dto/update-product.input';

@Injectable()
export class ProductEventHandlerService {
  constructor(private calculationsService: CalculationsService) {}

  async handleWarehouseProductOnDelete(
    product: Product,
    warehouseProduct: WarehouseProduct,
    manager: EntityManager,
  ) {
    const warehouseRepository = manager.getRepository(Warehouse);
    const warehouseProductRepository = manager.getRepository(WarehouseProduct);

    const warehouse = warehouseProduct.warehouse;

    const [productSize] = await Promise.all([
      this.calculationsService.calculateItemsSize({
        items: [
          {
            quantity: warehouseProduct.quantity,
            sizePerUnit: product.size,
          },
        ],
      }),
      warehouseProductRepository.delete({ id: warehouseProduct.id }),
    ]);

    const isOnlyProduct = warehouse.products?.length == 1;

    if (isOnlyProduct) {
      warehouse.hazardous = false;
      warehouse.takenSize = 0;
      warehouse.availableSize = warehouse.size;
    } else {
      const [takenSize, availableSize] = await Promise.all([
        this.calculationsService.deduct(warehouse.takenSize, productSize),
        this.calculationsService.sum([warehouse.availableSize, productSize]),
      ]);
      warehouse.takenSize = takenSize;
      warehouse.availableSize = availableSize;
    }

    await warehouseRepository.save(warehouse);
  }

  async handleWarehouseProductOnUpdate(
    product: Product,
    warehouseProduct: WarehouseProduct,
    updateProductInput: UpdateProductInput,
    manager: EntityManager,
  ) {
    const warehouseRepository = manager.getRepository(Warehouse);

    const warehouse = await warehouseRepository.findOneBy({
      id: warehouseProduct.warehouse.id,
    });

    const isHazardousChange =
      updateProductInput.hazardous !== undefined &&
      product.hazardous != updateProductInput.hazardous;

    if (isHazardousChange) {
      if (warehouseProduct.warehouse.products.length == 1) {
        warehouse.hazardous = updateProductInput.hazardous;
      } else if (warehouse.hazardous != updateProductInput.hazardous) {
        throw new BadRequestException({
          message: 'Cannot mix hazardous and non hazardous products',
          data: { warehouseId: warehouse.id },
        });
      }
    }

    const noSizeChange =
      updateProductInput.size == undefined ||
      product.size == updateProductInput.size;

    if (noSizeChange) return warehouseRepository.save(warehouse);

    const isIncreasedSize = product.size < updateProductInput.size;

    if (isIncreasedSize) {
      const extraSize = await this.calculationsService.deduct(
        updateProductInput.size,
        product.size,
      );

      const extraProductSize =
        await this.calculationsService.calculateItemsSize({
          items: [
            {
              quantity: warehouseProduct.quantity,
              sizePerUnit: extraSize,
            },
          ],
        });

      if (extraProductSize > warehouse.availableSize) {
        throw new BadRequestException({
          message: 'Warehouse does not have enough size',
          data: {
            warehouseId: warehouse.id,
            extraProductSize,
            availableSize: warehouse.availableSize,
          },
        });
      }

      const [availableSize, takenSize] = await Promise.all([
        this.calculationsService.deduct(
          warehouse.availableSize,
          extraProductSize,
        ),
        this.calculationsService.sum([warehouse.takenSize, extraProductSize]),
      ]);

      warehouse.availableSize = availableSize;
      warehouse.takenSize = takenSize;
    } else {
      const lessSize = await this.calculationsService.deduct(
        product.size,
        updateProductInput.size,
      );

      const lessProductSize = await this.calculationsService.calculateItemsSize(
        {
          items: [
            {
              quantity: warehouseProduct.quantity,
              sizePerUnit: lessSize,
            },
          ],
        },
      );

      const [availableSize, takenSize] = await Promise.all([
        this.calculationsService.sum([
          warehouse.availableSize,
          lessProductSize,
        ]),
        this.calculationsService.deduct(warehouse.takenSize, lessProductSize),
      ]);

      warehouse.availableSize = availableSize;
      warehouse.takenSize = takenSize;
    }

    return warehouseRepository.save(warehouse);
  }
}
