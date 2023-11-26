import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { Shipment } from './shipment/entities/shipment.entity';
import { WarehouseProduct } from './warehouse-product/entities/warehouse-product.entity';
import { Product } from './product/entities/product.entity';
import WarehouseSeeder from './database/seeds/warehouse.seeder';
import ProductSeeder from './database/seeds/product.seeder';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  database: 'test',
  port: 5432,
  username: 'root',
  password: 'root',
  entities: [Warehouse, Shipment, WarehouseProduct, Product],

  seeds: [WarehouseSeeder, ProductSeeder],
};

export const dataSource = new DataSource(options);
