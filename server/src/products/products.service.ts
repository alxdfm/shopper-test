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

  async validate(updateData: UpdatePriceDto[]): Promise<void | ErrorType> {
    try {
      //extract product code from array
      const getProductsCode = [];
      for (const item of updateData) {
        getProductsCode.push(item.productCode);
      }

      //find the match products and packs
      const productResult = await this.productRepository.find({
        where: this.mountWhereCode(getProductsCode, 'code'),
      });
      const packResultProduct = await this.packsRepository.find({
        where: this.mountWhereCode(getProductsCode, 'productId'),
      });

      const packResultPack = await this.packsRepository.find({
        where: this.mountWhereCode(getProductsCode, 'packId'),
      });

      const packResult = [...packResultPack, ...packResultProduct];

      //validate if exists a pack and the products included
      if (!packIncludesProduct(packResult, getProductsCode)) {
        ErrorFactory(
          'Há uma atualização de preço de pacotes sem atualização de preço de produtos.',
        );
      }

      //validate array is not empty
      if (!arrayIsNotEmpty(productResult)) {
        ErrorFactory(
          'Não foram encontrados produtos para os dados informados.',
        );
      }

      //validate the sum of products in a pack
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

        //validate if the sales if grater than cost
        if (!salesGreaterCost(data.newPrice, filter.costPrice)) {
          ErrorFactory(
            'O preço de venda de algum de seus produtos é maior que o custo do produto',
          );
        }
        //verify the max reajust according marketing
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
      const getProductsCode = [];

      for (const item of updateData) {
        getProductsCode.push(item.productCode);
      }

      const productResult = await this.productRepository.find({
        where: this.mountWhereCode(getProductsCode, 'code'),
      });

      const packResult = await this.packsRepository.find();

      if (!packIncludesProduct(packResult, getProductsCode)) {
        ErrorFactory(
          'Há uma atualização de preço de pacotes sem atualização de preço de produtos, ou o inverso.',
        );
      }

      if (productResult.length === 0) {
        ErrorFactory('Não foram encontrados produtos para os dados informados');
      }

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
