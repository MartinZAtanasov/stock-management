import { Controller, Post, Body } from '@nestjs/common';
import { CalculationsService } from './calculations.service';
import { CalculateSizeAvailabilityInput } from './dto/calculate-size-availability.input';
import { CalculateItemsSizeInput } from './dto/calculate-items-size.input';

@Controller('calculations')
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  @Post('calculate-size-availability')
  calculateSizeAvailability(
    @Body() calculateSizeAvailabilityDto: CalculateSizeAvailabilityInput,
  ) {
    return this.calculationsService.calculateSizeAvailability(
      calculateSizeAvailabilityDto,
    );
  }

  @Post('calculate-items-size')
  calculateItemsSize(@Body() calculateItemsSizeDto: CalculateItemsSizeInput) {
    return this.calculationsService.calculateItemsSize(calculateItemsSizeDto);
  }
}
