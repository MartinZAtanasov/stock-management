import { Injectable } from '@nestjs/common';
import { CalculateSizeAvailabilityInput } from './dto/calculate-size-availability.input';
import { CalculateItemsSizeInput } from './dto/calculate-items-size.input';
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
  async calculateSizeAvailability(payload: CalculateSizeAvailabilityInput) {
    const res = await fetcher(
      '/calculate-size-availability',
      JSON.stringify(payload),
    );
    const data = await res.json();
    if (!res.ok) throw new CustomHttpException(data, res.status, data.error);
    return data as { result: { availableSize: number; takenSize: number } };
  }

  async calculateItemsSize(payload: CalculateItemsSizeInput) {
    const res = await fetcher(
      '/calculate-items-size',
      JSON.stringify({ items: payload.items }),
    );
    const data = await res.json();
    if (!res.ok) throw new CustomHttpException(data, res.status, data.error);
    return data as { result: { itemsSize: number } };
  }
}
