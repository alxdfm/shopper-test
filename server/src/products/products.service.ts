import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { UpdatePriceDto } from './dto/update-price.dto';
import { Packs } from './entities/packs.entity';
import {
  arrayIsNotEmpty,
  checkPackPrice,
  maxReajustPrice,
  packIncludesProduct,
  removeDuplicated,
  salesGreaterCost,
} from './utils/products.validation';
import ErrorFactory, { ErrorType } from 'src/errors/error';
@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private productRepository: Repository<Product>,
    @Inject('PACKS_REPOSITORY')
    private packsRepository: Repository<Packs>,
  ) {}

  mountWhereCode(arrayId: number[], key: string) {
    const arrayResult = [];
    for (const id of arrayId) {
      arrayResult.push({ [key]: id });
    }
    return arrayResult;
  }

  getProductsCode(updateData) {
    const array = [];
    for (const item of updateData) {
      array.push(item.productCode);
    }
    return array;
  }

  async getProducts(productsCode) {
    return await this.productRepository.find({
      where: this.mountWhereCode(productsCode, 'code'),
    });
  }

  async getPacks(productsCode, findKey) {
    return await this.packsRepository.find({
      where: this.mountWhereCode(productsCode, findKey),
    });
  }

  async validate(updateData: UpdatePriceDto[]): Promise<void | ErrorType> {
    try {
      const getProductsCode = this.getProductsCode(updateData);

      const productResult = await this.getProducts(getProductsCode);

      const packResultProduct = await this.getPacks(
        getProductsCode,
        'productId',
      );

      const packResultPack = await this.getPacks(getProductsCode, 'packId');

      const packResult = [...packResultPack, ...packResultProduct];

      if (!packIncludesProduct(packResult, getProductsCode)) {
        ErrorFactory(
          'Há uma atualização de preço de pacotes sem atualização de preço de produtos.',
        );
      }

      if (!arrayIsNotEmpty(productResult)) {
        ErrorFactory(
          'Não foram encontrados produtos para os dados informados.',
        );
      }

      const packNoDuplicate = removeDuplicated(packResultPack);
      for (const pack of packNoDuplicate) {
        const filter = packResultPack.filter(
          (packR) => packR.packId === pack.packId,
        );
        if (!checkPackPrice(filter, updateData)) {
          ErrorFactory(
            'Existem pacotes cuja soma dos produtos não estão condizentes.',
          );
        }
      }

      for (const data of updateData) {
        const filter = productResult
          .filter((product) => product.code === data.productCode)
          .at(0);

        if (!salesGreaterCost(data.newPrice, filter.costPrice)) {
          ErrorFactory(
            'O preço de venda de algum de seus produtos é maior que o custo do produto',
          );
        }

        const percentage = 10;
        if (maxReajustPrice(percentage, filter.salesPrice, data.newPrice)) {
          ErrorFactory(
            `O preço de venda superou a variação de ${percentage}% solicitada pela equipe de marketing.`,
          );
        }
      }
    } catch (e) {
      return { errorMessage: e.message };
    }
  }

  async updatePrice(updateData: UpdatePriceDto[]): Promise<any> {
    try {
      const getProductsCode = this.getProductsCode(updateData);

      //find the match products and packs
      const productResult = await this.productRepository.find({
        where: this.mountWhereCode(getProductsCode, 'code'),
      });

      for (const item of productResult) {
        const filterUpdateData = updateData
          .filter((data) => data.productCode === item.code)
          .at(0);

        item.salesPrice = filterUpdateData.newPrice;
        this.productRepository.save(item);
      }
    } catch (e) {
      return { error: e.message };
    }
  }
}
