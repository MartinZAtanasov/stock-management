import { IsBoolean, IsOptional } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ProductsFilterInput {
  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { description: 'is product hazardous', nullable: true })
  hazardous: boolean;
}
