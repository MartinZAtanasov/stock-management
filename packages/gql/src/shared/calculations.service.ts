import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CalculateItemsSizeInput } from './dto/calculate-items-size.input';

@Injectable()
export class CalculationsService {
  private fetcher = (path: string, body: string, method = 'POST') =>
    fetch(process.env.CALCULATIONS_API_BASE_URL + path, {
      method,
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  async calculateItemsSize(payload: CalculateItemsSizeInput) {
    console.log(process.env.DB_HOST);

    const res = await this.fetcher(
      '/calculate-items-size',
      JSON.stringify({ items: payload.items }),
    );
    const data = await res.json();
    if (!res.ok) throw new InternalServerErrorException();
    return (data?.result || 0) as number;
  }

  async sum(numbers: number[]) {
    const res = await this.fetcher('/sum', JSON.stringify({ numbers }));
    const data = await res.json();
    if (!res.ok) throw new InternalServerErrorException();
    return (data?.result || 0) as number;
  }

  async deduct(numberA: number, numberB: number) {
    const res = await this.fetcher(
      '/deduct',
      JSON.stringify({ numberA, numberB }),
    );
    const data = await res.json();
    if (!res.ok) throw new InternalServerErrorException();
    return (data?.result || 0) as number;
  }
}
