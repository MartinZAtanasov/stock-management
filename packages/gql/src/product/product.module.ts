import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalculationsService } from 'src/shared/calculations.service';
import { ProductEventHandlerService } from './product-event-handler.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [
    ProductResolver,
    ProductService,
    CalculationsService,
    ProductEventHandlerService,
  ],
})
export class ProductModule {}
