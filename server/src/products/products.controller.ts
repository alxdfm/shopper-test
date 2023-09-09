import { Controller, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdatePriceDto } from './dto/products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/validate')
  validate(@Body() body: { dataToValidate: UpdatePriceDto[] }) {
    return this.productsService.validate(body.dataToValidate);
  }

  @Post('/update')
  updatePrice(@Body() body: { dataToUpdate: UpdatePriceDto[] }) {
    return this.productsService.updatePrice(body.dataToUpdate);
  }
}
