import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field(() => String, { description: 'name of the warehouse' })
  name: string;

  @Field(() => Int, { description: 'size of the product per unit' })
  size: number;

  @Field(() => Boolean, { description: 'is product hazardous' })
  hazardous: boolean;
}
