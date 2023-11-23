import { Controller, Post, Body } from '@nestjs/common';
import { CalculationsService } from './calculations.service';
import { CalculateSizeAvailabilityDto } from './dto/calculate-size-availability';

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
}
