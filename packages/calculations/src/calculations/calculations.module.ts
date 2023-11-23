import { Module } from '@nestjs/common';
import { CalculationsService } from './calculations.service';
import { CalculationsController } from './calculations.controller';

@Module({
  controllers: [CalculationsController],
  providers: [CalculationsService],
})
export class CalculationsModule {}
