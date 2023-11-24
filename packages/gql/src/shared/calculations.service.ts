import { BadRequestException, Injectable } from '@nestjs/common';
import { CalculateSizeAvailabilityDto } from './dto/calculate-size-availability.input';
import { CalculateItemsSizeDto } from './dto/calculate-items-size.input';
import { CustomHttpException } from 'src/exceptions/custom-http.exception';

const baseURL = 'http://localhost:3001/calculations';

const fetcher = (path: string, body: string, method = 'POST') =>
  fetch(baseURL + path, {
    method,
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  });

@Injectable()
export class CalculationsService {
  async calculateSizeAvailability(payload: CalculateSizeAvailabilityDto) {
    const res = await fetcher(
      '/calculate-size-availability',
      JSON.stringify(payload),
    );
    const data = await res.json();
    if (!res.ok) throw new CustomHttpException(data, res.status, data.error);
    return data as { result: { availableSize: number; takenSize: number } };
  }

  async calculateItemsSize(payload: CalculateItemsSizeDto) {
    const res = await fetcher(
      '/calculate-items-size',
      JSON.stringify({ items: payload.items }),
    );
    const data = await res.json();
    if (!res.ok) throw new BadRequestException(data);
    return data as { result: { itemsSize: number } };
  }
}
