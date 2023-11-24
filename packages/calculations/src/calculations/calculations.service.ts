import { Injectable } from '@nestjs/common';
import { CalculateSizeAvailabilityDto } from './dto/calculate-size-availability.input';
import { CalculateItemsSizeDto } from './dto/calculate-items-size.input';

@Injectable()
export class CalculationsService {
  calculateSizeAvailability({ items, size }: CalculateSizeAvailabilityDto) {
    const itemsSize = items.reduce((acc, current) => {
      const itemSize = current.quantity * current.sizePerUnit;
      return acc + itemSize;
    }, 0);

    const availableSize = size - itemsSize;

    return {
      result: {
        availableSize: availableSize <= 0 ? 0 : availableSize,
        takenSize: itemsSize,
      },
    };
  }

  calculateItemsSize({ items }: CalculateItemsSizeDto) {
    const itemsSize = items.reduce((acc, current) => {
      const itemSize = current.quantity * current.sizePerUnit;
      return acc + itemSize;
    }, 0);

    return { result: { itemsSize } };
  }
}
