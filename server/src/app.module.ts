import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import configuration from './config/databaseConfig';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ load: [configuration] }),
    ProductsModule,
  ],
})
export class AppModule {}
