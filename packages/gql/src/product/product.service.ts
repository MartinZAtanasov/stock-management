import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsFilterInput } from './dto/products-filter-input';
import { WarehouseProduct } from 'src/warehouse-product/entities/warehouse-product.entity';
import { ProductEventHandlerService } from './product-event-handler.service';
import { UserInputError } from '@nestjs/apollo';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private productEventHandlerService: ProductEventHandlerService,
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
    const product = await this.productRepository.findOneByOrFail({
      id: updateProductInput.id,
    });

    return this.productRepository.manager.transaction(async (manager) => {
      const productRepository = manager.getRepository(Product);
      const warehouseProductRepository =
        manager.getRepository(WarehouseProduct);

      const warehouseProducts = await warehouseProductRepository.find({
        where: { product: { id: product.id } },
        relations: { warehouse: { products: true } },
      });

      const promisesResults = await Promise.allSettled(
        warehouseProducts.map((warehouseProduct) =>
          this.productEventHandlerService.handleWarehouseProductOnUpdate(
            product,
            warehouseProduct,
            updateProductInput,
            manager,
          ),
        ),
      );

      const errors = promisesResults.filter((v) => v.status == 'rejected');
      if (errors.length) {
        throw new UserInputError('Something went wrong', {
          extensions: {
            code: HttpStatus.BAD_REQUEST,
            errors: errors.map((e: any) => ({
              ...e?.reason,
              ...e?.reason?.response,
              response: undefined,
              code: HttpStatus.BAD_REQUEST,
            })),
          },
        });
      }
      return productRepository.save({ ...product, ...updateProductInput });
    });
  }

  async remove(id: number) {
    const product = await this.productRepository.findOneOrFail({
      where: { id },
    });
    return this.productRepository.manager.transaction(async (manager) => {
      const productRepository = manager.getRepository(Product);
      const warehouseProductRepository =
        manager.getRepository(WarehouseProduct);

      const warehouseProducts = await warehouseProductRepository.find({
        where: { product: { id: id } },
        relations: { warehouse: { products: true } },
      });

      const promisesResults = await Promise.allSettled(
        warehouseProducts.map((warehouseProduct) =>
          this.productEventHandlerService.handleWarehouseProductOnDelete(
            product,
            warehouseProduct,
            manager,
          ),
        ),
      );

      const error: any = promisesResults.find((v) => v.status == 'rejected');
      if (error) throw new InternalServerErrorException(error?.reason?.message);

      await productRepository.delete({ id });
      return product;
    });
  }
}
