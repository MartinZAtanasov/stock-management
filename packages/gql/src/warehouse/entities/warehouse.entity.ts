import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Warehouse {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int, { description: 'id of the warehouse' })
  id: number;

  @Column({ unique: true })
  @Field(() => String, { description: 'name of the warehouse' })
  name: string;

  @Column('int')
  @Field(() => Int, { description: 'size capacity of the warehouse' })
  size: number;
}
