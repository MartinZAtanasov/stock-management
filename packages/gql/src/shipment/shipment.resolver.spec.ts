import { Test, TestingModule } from '@nestjs/testing';
import { ShipmentResolver } from './shipment.resolver';
import { ShipmentService } from './shipment.service';

describe('ShipmentResolver', () => {
  let resolver: ShipmentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShipmentResolver, ShipmentService],
    }).compile();

    resolver = module.get<ShipmentResolver>(ShipmentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
