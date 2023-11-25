export class ItemInput {
  quantity: number;
  sizePerUnit: number;
}

export class CalculateItemsSizeInput {
  items: ItemInput[];
}
