import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { UpdatePriceDto } from './dto/update-price.dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private productRepository: Repository<Product>,
  ) {}

  mountWhere(arrayCode: number[]) {
    const arrayResult: { code: number }[] = [];
    for (const code of arrayCode) {
      arrayResult.push({ code });
    }
    return arrayResult;
  }

  async findMany(productsCode: number[]): Promise<Product[]> {
    const result = this.productRepository.find({
      where: this.mountWhere(productsCode),
    });
    return result;
  }

  async updatePrice(updateData: UpdatePriceDto[]): Promise<void> {
    const getProductsCode = [];

    for (const item of updateData) {
      getProductsCode.push(item.product_code);
    }

    const result = await this.findMany(getProductsCode);

    if (result.length === 0) {
      return;
    }

    for (const item of result) {
      const filterUpdateData = updateData
        .filter((data) => data.product_code === item.code)
        .at(0);

      item.sales_price = filterUpdateData.new_price;
      this.productRepository.save(item);
    }
  }
}
