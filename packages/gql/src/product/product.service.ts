import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsFilterInput } from './dto/products-filter-input';
import { WarehouseProduct } from 'src/warehouse-product/entities/warehouse-product.entity';
import { CalculationsService } from 'src/shared/calculations.service';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private calculationsService: CalculationsService,
  ) {}

  create(createProductInput: CreateProductInput) {
    const newProduct = this.productRepository.create(createProductInput);
    return this.productRepository.save(newProduct);
  }

  findAll(productsFilterInput: ProductsFilterInput) {
    return this.productRepository.find({ where: productsFilterInput });
  }

  findOne(id: number) {
    return this.productRepository.findOneByOrFail({ id });
  }

  async update(updateProductInput: UpdateProductInput) {
    // TODO: Handle clean up
    const product = await this.productRepository.findOneByOrFail({
      id: updateProductInput.id,
    });

    return this.productRepository.manager.transaction(async (manager) => {
      const productRepository = manager.getRepository(Product);
      const warehouseRepository = manager.getRepository(Warehouse);
      const warehouseProductRepository =
        manager.getRepository(WarehouseProduct);

      const warehouseProducts = await warehouseProductRepository.find({
        where: { product: { id: product.id } },
        relations: { warehouse: { products: true } },
      });

      const promisesResults = await Promise.allSettled(
        warehouseProducts.map(async (warehouseProduct) => {
          const warehouse = warehouseProduct.warehouse;

          // Hazardous validation
          const isHazardousChange =
            updateProductInput.hazardous !== undefined &&
            product.hazardous != updateProductInput.hazardous;

          if (isHazardousChange) {
            if (warehouse.products.length == 1) {
              warehouse.hazardous == updateProductInput.hazardous;
            }
            if (warehouse.hazardous != updateProductInput.hazardous) {
              throw new Error(
                'Cannot mix hazardous and non hazardous products for warehouse ' +
                  warehouse.id,
              );
            }
          }

          const noSizeChange =
            updateProductInput.size == undefined ||
            product.size == updateProductInput.size;

          if (noSizeChange) return;

          // Size validation
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
              throw new Error(
                `Warehouse ${warehouse.id} doesn't have enough size`,
              );
            }

            warehouse.availableSize = await this.calculationsService.deduct(
              warehouse.availableSize,
              extraProductSize,
            );

            warehouse.takenSize = await this.calculationsService.sum([
              warehouse.takenSize,
              extraProductSize,
            ]);
          } else {
            const lessSize = await this.calculationsService.deduct(
              product.size,
              updateProductInput.size,
            );

            const lessProductSize =
              await this.calculationsService.calculateItemsSize({
                items: [
                  {
                    quantity: warehouseProduct.quantity,
                    sizePerUnit: lessSize,
                  },
                ],
              });

            warehouse.availableSize = await this.calculationsService.sum([
              warehouse.availableSize,
              lessProductSize,
            ]);

            warehouse.takenSize = await this.calculationsService.deduct(
              warehouse.takenSize,
              lessProductSize,
            );
          }
          await warehouseRepository.save(warehouse);
        }),
      );

      const errors = promisesResults.filter((v) => v.status == 'rejected');

      if (errors.length) {
        throw new InternalServerErrorException(
          errors.map((err: any) => err?.reason).join('; '),
        );
      }
      return productRepository.save({ ...product, ...updateProductInput });
    });
  }

  // TODO: Extract into another service
  // TODO: Custom error codes
  async remove(id: number) {
    const product = await this.productRepository.findOneOrFail({
      where: { id },
    });
    return this.productRepository.manager.transaction(async (manager) => {
      const productRepository = manager.getRepository(Product);
      const warehouseRepository = manager.getRepository(Warehouse);
      const warehouseProductRepository =
        manager.getRepository(WarehouseProduct);

      const warehouseProducts = await warehouseProductRepository.find({
        where: { product: { id: id } },
        relations: { warehouse: { products: true } },
      });

      const promisesResults = await Promise.allSettled(
        warehouseProducts.map(async (warehouseProduct) => {
          const warehouse = warehouseProduct.warehouse;

          const productSize = await this.calculationsService.calculateItemsSize(
            {
              items: [
                {
                  quantity: warehouseProduct.quantity,
                  sizePerUnit: product.size,
                },
              ],
            },
          );

          await warehouseProductRepository.delete({ id: warehouseProduct.id });

          const isOnlyProduct = warehouse.products?.length == 1;

          if (isOnlyProduct) {
            warehouse.hazardous = false;
            warehouse.takenSize = 0;
            warehouse.availableSize = warehouse.size;
          } else {
            warehouse.takenSize = await this.calculationsService.deduct(
              warehouse.takenSize,
              productSize,
            );
            warehouse.availableSize = await this.calculationsService.sum([
              warehouse.availableSize,
              productSize,
            ]);
          }

          await warehouseRepository.save(warehouse);
        }),
      );

      const err = promisesResults.find((v) => v.status == 'rejected');
      if (err) throw new InternalServerErrorException(err);

      await productRepository.delete({ id });
      return product;
    });
  }
}
