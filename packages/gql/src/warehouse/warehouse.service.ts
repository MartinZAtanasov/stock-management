import { Injectable } from '@nestjs/common';
import { CreateWarehouseInput } from './dto/create-warehouse.input';
import { UpdateWarehouseInput } from './dto/update-warehouse.input';
import { Warehouse } from './entities/warehouse.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CalculationsService } from 'src/shared/calculations.service';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    private calculationsService: CalculationsService,
  ) {}

  create(createWarehouseInput: CreateWarehouseInput) {
    const newWarehouse = this.warehouseRepository.create(createWarehouseInput);
    newWarehouse.availableSize = createWarehouseInput.size;
    return this.warehouseRepository.save(newWarehouse);
  }

  async findAll(): Promise<Warehouse[]> {
    return this.warehouseRepository.find({
      relations: {
        shipments: true,
        products: { product: true, warehouse: true },
      },
    });
  }

  findOne(id: number) {
    return this.warehouseRepository.findOneOrFail({
      where: { id },
      relations: { shipments: true },
    });
  }

  async update(updateWarehouseInput: UpdateWarehouseInput) {
    const warehouse = await this.warehouseRepository.findOneByOrFail({
      id: updateWarehouseInput.id,
    });
    return this.warehouseRepository.save({
      ...warehouse,
      ...updateWarehouseInput,
    });
  }

  async remove(id: number) {
    const warehouse = await this.warehouseRepository.findOneOrFail({
      where: { id },
      relations: { shipments: true },
    });
    await this.warehouseRepository.delete({ id });
    return warehouse;
  }
}
