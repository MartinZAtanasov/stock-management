import { Injectable } from '@nestjs/common';
import { CreateWarehouseProductInput } from './dto/create-warehouse-product.input';
import { UpdateWarehouseProductInput } from './dto/update-warehouse-product.input';

@Injectable()
export class WarehouseProductService {
  create(createWarehouseProductInput: CreateWarehouseProductInput) {
    return 'This action adds a new warehouseProduct';
  }

  findAll() {
    return `This action returns all warehouseProduct`;
  }

  findOne(id: number) {
    return `This action returns a #${id} warehouseProduct`;
  }

  update(id: number, updateWarehouseProductInput: UpdateWarehouseProductInput) {
    return `This action updates a #${id} warehouseProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} warehouseProduct`;
  }
}
