import { Injectable } from '@nestjs/common';
import { CreateWarehouseInput } from './dto/create-warehouse.input';
import { UpdateWarehouseInput } from './dto/update-warehouse.input';
import { Warehouse } from './entities/warehouse.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  create(createWarehouseInput: CreateWarehouseInput) {
    const newWarehouse = this.warehouseRepository.create(createWarehouseInput);
    return this.warehouseRepository.save(newWarehouse);
  }

  findAll(): Promise<Warehouse[]> {
    return this.warehouseRepository.find();
  }

  findOne(id: number) {
    return this.warehouseRepository.findOneBy({ id });
  }

  update(updateWarehouseInput: UpdateWarehouseInput) {
    const warehouse = { ...new Warehouse(), ...updateWarehouseInput };
    return this.warehouseRepository.save(warehouse);
  }

  remove(id: number) {
    return this.warehouseRepository.delete({ id });
  }
}
