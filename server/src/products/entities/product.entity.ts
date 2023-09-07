import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryColumn({ primary: true })
  code: number;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'cost_price', type: 'decimal' })
  costPrice: number;

  @Column({ name: 'sales_price', type: 'decimal' })
  salesPrice: number;
}
