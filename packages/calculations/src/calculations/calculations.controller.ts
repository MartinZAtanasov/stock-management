import { Controller, Post, Body } from '@nestjs/common';
import { CalculationsService } from './calculations.service';
import { CalculateItemsSizeInput } from './dto/calculate-items-size.input';
import { SumInput } from './dto/sum.input';
import { DeductInput } from './dto/deduct.input';

@Controller('calculations')
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  @Post('calculate-items-size')
  calculateItemsSize(@Body() calculateItemsSizeDto: CalculateItemsSizeInput) {
    return this.calculationsService.calculateItemsSize(calculateItemsSizeDto);
  }

  @Post('sum')
  sum(@Body() sumInput: SumInput) {
    return this.calculationsService.sum(sumInput);
  }

  @Post('deduct')
  deduct(@Body() deductInput: DeductInput) {
    return this.calculationsService.deduct(deductInput);
  }
}
