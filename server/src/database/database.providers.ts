import { DataSource } from 'typeorm';
import db from '../config/databaseConfig';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: db().host,
        port: Number(db().port),
        username: db().user,
        password: db().password,
        database: db().name,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      });

      return dataSource.initialize();
    },
  },
];
