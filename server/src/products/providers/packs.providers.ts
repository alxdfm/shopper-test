import { DataSource } from 'typeorm';
import { Packs } from '../entities/packs.entity';

export const packsProviders = [
  {
    provide: 'PACKS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Packs),
    inject: ['DATA_SOURCE'],
  },
];
