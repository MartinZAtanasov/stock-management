import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CalculateItemsSizeInput } from './dto/calculate-items-size.input';

const baseURL = process.env.CALCULATIONS_API_BASE_URL;

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
  async calculateItemsSize(payload: CalculateItemsSizeInput) {
    const res = await fetcher(
      '/calculate-items-size',
      JSON.stringify({ items: payload.items }),
    );
    const data = await res.json();
    if (!res.ok) throw new InternalServerErrorException();
    return (data?.result || 0) as number;
  }

  async sum(numbers: number[]) {
    const res = await fetcher('/sum', JSON.stringify({ numbers }));
    const data = await res.json();
    if (!res.ok) throw new InternalServerErrorException();
    return (data?.result || 0) as number;
  }

  async deduct(numberA: number, numberB: number) {
    const res = await fetcher('/deduct', JSON.stringify({ numberA, numberB }));
    const data = await res.json();
    if (!res.ok) throw new InternalServerErrorException();
    return (data?.result || 0) as number;
  }
}
