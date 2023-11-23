import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalculationsModule } from './calculations/calculations.module';

@Module({
  imports: [CalculationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
