import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'packs' })
export class Packs {
  @PrimaryColumn({ primary: true })
  id: number;

  @Column({ name: 'pack_id' })
  packId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'qty' })
  qty: number;
}
