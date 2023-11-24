import { Injectable } from '@nestjs/common';
import { CalculateSizeAvailabilityInput } from './dto/calculate-size-availability.input';
import { CalculateItemsSizeInput } from './dto/calculate-items-size.input';

@Injectable()
export class CalculationsService {
  calculateSizeAvailability({ items, size }: CalculateSizeAvailabilityInput) {
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

  calculateItemsSize({ items }: CalculateItemsSizeInput) {
    const itemsSize = items.reduce((acc, current) => {
      const itemSize = current.quantity * current.sizePerUnit;
      return acc + itemSize;
    }, 0);

    return { result: { itemsSize } };
  }
}
