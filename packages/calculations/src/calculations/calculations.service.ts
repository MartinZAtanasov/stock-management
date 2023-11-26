import { Injectable } from '@nestjs/common';
import { CalculateItemsSizeInput } from './dto/calculate-items-size.input';
import { SumInput } from './dto/sum.input';
import { DeductInput } from './dto/deduct.input';
import { subtract, add, multiply } from 'mathjs';

@Injectable()
export class CalculationsService {
  calculateItemsSize({ items }: CalculateItemsSizeInput) {
    const itemsSize = items.reduce((acc, current) => {
      const itemSize = multiply(current.quantity, current.sizePerUnit);
      return add(acc, itemSize);
    }, 0);

    return { result: itemsSize };
  }

  async sum({ numbers }: SumInput) {
    return { result: numbers.reduce((a, b) => add(a, b), 0) };
  }

  async deduct({ numberA, numberB }: DeductInput) {
    return { result: subtract(numberA, numberB) };
  }
}
