import { Controller, Post, Body } from '@nestjs/common';
import { CalculationsService } from './calculations.service';
import { CalculateSizeAvailabilityDto } from './dto/calculate-size-availability.input';
import { CalculateItemsSizeDto } from './dto/calculate-items-size.input';

@Controller('calculations')
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  @Post('calculate-size-availability')
  calculateSizeAvailability(
    @Body() calculateSizeAvailabilityDto: CalculateSizeAvailabilityDto,
  ) {
    return this.calculationsService.calculateSizeAvailability(
      calculateSizeAvailabilityDto,
    );
  }

  @Post('calculate-items-size')
  calculateItemsSize(@Body() calculateItemsSizeDto: CalculateItemsSizeDto) {
    return this.calculationsService.calculateItemsSize(calculateItemsSizeDto);
  }
}
