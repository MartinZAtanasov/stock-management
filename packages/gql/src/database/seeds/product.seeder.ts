import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';

export default class ProductSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Product);

    await repository.insert([
      {
        name: 'P 1',
        size: 1,
        hazardous: true,
      },
      {
        name: 'P 2',
        size: 3,
        hazardous: true,
      },
      {
        name: 'P 2',
        size: 5,
        hazardous: false,
      },
    ]);
  }
}
