import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ReturnProduct, UpdatePriceDto } from './dto/products.dto';
import { Packs } from './entities/packs.entity';
import {
  arrayValidate,
  checkPackPrice,
  maxReajustPrice,
  salesGreaterCost,
} from './utils/products.validation';
import ErrorFactory, { ErrorType } from 'src/errors/error';
import {
  addError,
  chargeProductInfos,
  extractProductIdFromPack,
  getProductsCode,
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

  async getAllProducts() {
    return await this.productRepository.find();
  }

  async getPacks(productsCode, findKey) {
    return await this.packsRepository.find({
      where: this.mountWhereCode(productsCode, findKey),
    });
  }

  async getAllPacks() {
    return await this.packsRepository.find();
  }

  async validate(
    updateData: UpdatePriceDto[],
  ): Promise<ReturnProduct[] | ErrorType> {
    try {
      const productsCode: number[] = getProductsCode(updateData);

      const productResult = await this.getProducts(productsCode);

      const packResultPack = await this.getPacks(productsCode, 'packId');

      const productInfos: ReturnProduct[] = chargeProductInfos(
        productResult,
        updateData,
      );

      if (!arrayValidate(productResult, updateData)) {
        ErrorFactory(
          'Não foram encontrados um ou mais produtos para os dados informados.',
        );
      }

      const packNoDuplicate = removeDuplicatedPacks(packResultPack);
      for (const pack of packNoDuplicate) {
        const filter = packResultPack.filter(
          (packR) => packR.packId === pack.packId,
        );

        checkPackPrice(filter, updateData, productInfos);
      }

      for (const data of updateData) {
        const filter = productResult
          .filter((product) => product.code === data.productCode)
          .at(0);

        if (!salesGreaterCost(data.newPrice, filter.costPrice)) {
          const updatedProductInfo = addError(
            filter,
            productInfos,
            'O preço de venda é menor que o custo do produto',
          );

          if (updatedProductInfo) {
            productInfos.push(updatedProductInfo);
          }
        }

        const percentage = 10;
        if (maxReajustPrice(percentage, filter.salesPrice, data.newPrice)) {
          const updatedProductInfo = addError(
            filter,
            productInfos,
            `O preço de venda superou a variação de ${percentage}% solicitada pela equipe de marketing.`,
          );

          if (updatedProductInfo) {
            productInfos.push(updatedProductInfo);
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

      const productResult = await this.getProducts(productsCode);

      const packResultPack = await this.getAllPacks();

      const allProducts = await this.getAllProducts();

      for (const item of productResult) {
        const filterUpdateData = updateData
          .filter((data) => data.productCode === item.code)
          .at(0);

        if (extractProductIdFromPack(packResultPack).includes(item.code)) {
          for (const pack of packResultPack) {
            if (item.code === pack.productId) {
              const packs = allProducts
                .filter((prod) => pack.packId === prod.code)
                .at(0);

              const product = allProducts
                .filter((prod) => pack.productId === prod.code)
                .at(0);

              const oldProductValue = product.salesPrice * pack.qty;
              const newProductValue = filterUpdateData.newPrice * pack.qty;

              const difference = newProductValue - oldProductValue;

              packs.salesPrice = Number(packs.salesPrice) + Number(difference);
              this.productRepository.save(packs);

              item.salesPrice = filterUpdateData.newPrice;
              this.productRepository.save(item);
            }
          }
        } else {
          item.salesPrice = filterUpdateData.newPrice;
          this.productRepository.save(item);
        }
      }
    } catch (e) {
      return { error: e.message };
    }
  }
}
