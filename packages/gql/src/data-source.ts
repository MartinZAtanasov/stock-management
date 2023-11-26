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
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Warehouse, Shipment, WarehouseProduct, Product],

  seeds: [WarehouseSeeder, ProductSeeder],
};

export const dataSource = new DataSource(options);
