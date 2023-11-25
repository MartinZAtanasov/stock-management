import { IsBoolean, IsOptional, IsPositive } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class WarehousesFilterInput {
  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, {
    description: 'is warehouse hazardous',
    nullable: true,
  })
  hazardous: boolean;

  @IsOptional()
  @IsPositive()
  @Field(() => Int, { description: 'size per unit', nullable: true })
  minAvailableSize: number;

  @IsOptional()
  @IsPositive()
  @Field(() => Int, {
    description: 'warehouse has product',
    nullable: true,
  })
  productId: number;

  @IsOptional()
  @IsPositive()
  @Field(() => Int, { description: 'warehouse max size', nullable: true })
  maxSize: number;

  @IsOptional()
  @IsPositive()
  @Field(() => Int, { description: 'warehouse min size', nullable: true })
  minSize: number;
}
