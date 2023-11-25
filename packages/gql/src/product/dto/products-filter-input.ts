import { IsBoolean, IsOptional, IsPositive } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class ProductsFilterInput {
  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { description: 'is product hazardous', nullable: true })
  hazardous: boolean;

  @IsOptional()
  @IsPositive()
  @Field(() => Int, { description: 'max size per unit', nullable: true })
  maxSize: number;

  @IsOptional()
  @IsPositive()
  @Field(() => Int, { description: 'min size per unit', nullable: true })
  minSize: number;
}
