import { Injectable } from '@nestjs/common';
import { CalculateSizeAvailabilityDto } from './dto/calculate-size-availability';

@Injectable()
export class CalculationsService {
  calculateSizeAvailability({ items, size }: CalculateSizeAvailabilityDto) {
    const itemsTotalSize = items.reduce((acc, current) => {
      const itemSize = current.quantity * current.sizePerUnit;
      return acc + itemSize;
    }, 0);

    const availableSize = size - itemsTotalSize;

    return {
      availableSize: availableSize <= 0 ? 0 : availableSize,
      takenSize: itemsTotalSize,
    };
  }
}
