import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

export default class WarehouseSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Warehouse);

    await repository.insert([
      {
        name: 'W 1',
        size: 10,
        availableSize: 10,
        takenSize: 0,
        hazardous: true,
      },
      {
        name: 'W 2',
        size: 20,
        availableSize: 10,
        takenSize: 0,
        hazardous: true,
      },
    ]);
  }
}
