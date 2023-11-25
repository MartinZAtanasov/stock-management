import { Injectable } from '@nestjs/common';
import { Warehouse } from './entities/warehouse.entity';
import {
  Between,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WarehousesFilterInput } from './dto/warehouses-filter.input';
import { UserInputError } from '@nestjs/apollo';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  findAll(warehousesFilterInput?: WarehousesFilterInput): Promise<Warehouse[]> {
    const { hazardous, minAvailableSize, productId, minSize, maxSize } =
      warehousesFilterInput || {};

    const availableSizeFilter: FindOperator<number> | undefined = (() => {
      if (minAvailableSize == undefined) return undefined;
      return MoreThanOrEqual(minAvailableSize);
    })();

    const productsFilter = (() => {
      if (productId == undefined) return undefined;
      return { product: { id: productId } };
    })();

    const sizeFilter: FindOperator<number> | undefined = (() => {
      if (maxSize == undefined && minSize == undefined) {
        return undefined;
      }

      if (maxSize < minSize) {
        throw new UserInputError('maxSize cannot be less than minSize');
      }

      if (maxSize && minSize == undefined) {
        return LessThanOrEqual(maxSize);
      }

      if (minSize && maxSize == undefined) {
        return MoreThanOrEqual(minSize);
      }

      return Between(minSize, maxSize);
    })();

    return this.warehouseRepository.find({
      where: {
        hazardous,
        availableSize: availableSizeFilter,
        products: productsFilter,
        size: sizeFilter,
      },
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
