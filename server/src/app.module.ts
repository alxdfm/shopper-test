import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import databaseConfig from './config/databaseConfig';
import appConfig from './config/appConfig';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ load: [databaseConfig, appConfig] }),
    ProductsModule,
  ],
})
export class AppModule {}
