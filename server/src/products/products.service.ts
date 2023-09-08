import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ReturnProduct, UpdatePriceDto } from './dto/products.dto';
import { Packs } from './entities/packs.entity';
import {
  arrayIsNotEmpty,
  checkPackPrice,
  maxReajustPrice,
  packIncludesProduct,
  salesGreaterCost,
} from './utils/products.validation';
import ErrorFactory, { ErrorType } from 'src/errors/error';
import {
  addError,
  chargeProductInfos,
  getProductsCode,
  mergeErrors,
  removeDuplicatedPacks,
  removeDuplicatedReturnProducts,
} from './utils/utils';
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

  async validate(
    updateData: UpdatePriceDto[],
  ): Promise<ReturnProduct[] | ErrorType> {
    try {
      const productsCode: number[] = getProductsCode(updateData);

      const productResult = await this.getProducts(productsCode);

      const packResultProduct = await this.getPacks(productsCode, 'productId');

      const packResultPack = await this.getPacks(productsCode, 'packId');

      const packResult = [...packResultPack, ...packResultProduct];

      const productInfos: ReturnProduct[] = chargeProductInfos(
        productResult,
        updateData,
      );

      if (!arrayIsNotEmpty(productResult)) {
        ErrorFactory(
          'Não foram encontrados produtos para os dados informados.',
        );
      }

      const validatePackIncludesProduct = packIncludesProduct(
        packResult,
        productsCode,
        productResult,
      );

      validatePackIncludesProduct.map((product) => productInfos.push(product));

      const packNoDuplicate = removeDuplicatedPacks(packResultPack);
      for (const pack of packNoDuplicate) {
        const filter = packResultPack.filter(
          (packR) => packR.packId === pack.packId,
        );

        const validateCheckPackPrice = checkPackPrice(
          filter,
          updateData,
          productResult,
        );

        const oldProducts = productInfos;
        productInfos.push(validateCheckPackPrice);
        mergeErrors(oldProducts, productInfos);
      }

      for (const data of updateData) {
        const filter = productResult
          .filter((product) => product.code === data.productCode)
          .at(0);

        if (!salesGreaterCost(data.newPrice, filter.costPrice)) {
          const updatedProductInfo = addError(
            filter,
            data.newPrice,
            productInfos,
            'O preço de venda é menor que o custo do produto',
          );

          if (updatedProductInfo) {
            const oldProducts = productInfos;
            productInfos.push(updatedProductInfo);
            mergeErrors(oldProducts, productInfos);
          }
        }

        const percentage = 10;
        if (maxReajustPrice(percentage, filter.salesPrice, data.newPrice)) {
          const updatedProductInfo = addError(
            filter,
            data.newPrice,
            productInfos,
            `O preço de venda superou a variação de ${percentage}% solicitada pela equipe de marketing.`,
          );

          if (updatedProductInfo) {
            const oldProducts = productInfos;
            productInfos.push(updatedProductInfo);
            mergeErrors(oldProducts, productInfos);
          }
        }
      }

      return removeDuplicatedReturnProducts(productInfos);
    } catch (e) {
      return { errorMessage: e.message };
    }
  }

  async updatePrice(updateData: UpdatePriceDto[]): Promise<any> {
    try {
      const productsCode = getProductsCode(updateData);

      //find the match products and packs
      const productResult = await this.productRepository.find({
        where: this.mountWhereCode(productsCode, 'code'),
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
