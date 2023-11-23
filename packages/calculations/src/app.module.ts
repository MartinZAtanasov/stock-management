import { Module } from '@nestjs/common';
import { CalculationsModule } from './calculations/calculations.module';

@Module({
  imports: [CalculationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
