import { Injectable } from '@nestjs/common';
import { Warehouse } from './entities/warehouse.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  async findAll(): Promise<Warehouse[]> {
    return this.warehouseRepository.find({
      relations: {
        shipments: true,
        products: { product: true },
      },
    });
  }

  findOne(id: number) {
    return this.warehouseRepository.findOneOrFail({
      where: { id },
      relations: { shipments: true },
    });
  }
}
