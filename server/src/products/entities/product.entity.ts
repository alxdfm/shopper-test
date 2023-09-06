import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryColumn({ primary: true })
  code: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'decimal' })
  cost_price: number;

  @Column({ type: 'decimal' })
  sales_price: number;
}
