import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdatePriceDto } from './dto/update-price.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  validate(@Body() body: { dataToValidate: UpdatePriceDto[] }) {
    return this.productsService.validate(body.dataToValidate);
  }

  @Post()
  updatePrice(@Body() body: { dataToUpdate: UpdatePriceDto[] }) {
    return this.productsService.updatePrice(body.dataToUpdate);
  }
}
