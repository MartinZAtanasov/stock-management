import { Injectable } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  create(createProductInput: CreateProductInput) {
    const newProduct = this.productRepository.create(createProductInput);
    return this.productRepository.save(newProduct);
  }

  findAll() {
    return this.productRepository.find();
  }

  findOne(id: number) {
    return this.productRepository.findOneByOrFail({ id });
  }

  async update(updateProductInput: UpdateProductInput) {
    const product = await this.productRepository.findOneByOrFail({
      id: updateProductInput.id,
    });
    return this.productRepository.save({ ...product, ...updateProductInput });
  }

  async remove(id: number) {
    const product = await this.productRepository.findOneOrFail({
      where: { id },
    });
    await this.productRepository.delete({ id });
    return product;
  }
}
