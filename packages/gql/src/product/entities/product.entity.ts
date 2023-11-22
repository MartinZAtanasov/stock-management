import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int, { description: 'id of the product' })
  id: number;

  @Column()
  @Field(() => String, { description: 'name of the product' })
  name: string;

  @Column('int')
  @Field(() => Int, { description: 'size per unit' })
  size: number;

  @Column('boolean')
  @Field(() => Boolean, { description: 'is product hazardous' })
  hazardous: boolean;
}
