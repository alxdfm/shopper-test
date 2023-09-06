import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { productProviders } from './providers/products.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController],
  providers: [...productProviders, ProductsService],
})
export class ProductsModule {}
