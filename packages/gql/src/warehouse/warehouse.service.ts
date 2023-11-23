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
    return this.warehouseRepository.find({ relations: { shipments: true } });
  }

  findOne(id: number) {
    return this.warehouseRepository.findOneBy({ id });
  }

  async update(updateWarehouseInput: UpdateWarehouseInput) {
    const warehouse = await this.warehouseRepository.findOneBy({
      id: updateWarehouseInput.id,
    });
    return this.warehouseRepository.save({
      ...warehouse,
      ...updateWarehouseInput,
    });
  }

  remove(id: number) {
    return this.warehouseRepository.delete({ id });
  }
}
