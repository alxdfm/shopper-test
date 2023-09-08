import { ReturnProduct, UpdatePriceDto } from '../dto/products.dto';
import { Packs } from '../entities/packs.entity';
import { Product } from '../entities/product.entity';
import { checkDuplicateReturnProduct, getProductById } from './utils';

export const salesGreaterCost = (salesPrice: number, costPrice: number) => {
  return salesPrice > costPrice;
};

export const maxReajustPrice = (
  percentage: number,
  oldPrice: number,
  newPrice: number,
) => {
  const maxReajustDiff = (percentage / 100) * oldPrice;
  return maxReajustDiff < Math.abs(newPrice - oldPrice);
};

export const packIncludesProduct = (
  pack: Packs[],
  productsCode: number[],
  products: Product[],
): ReturnProduct[] => {
  const returnProducts: ReturnProduct[] = [];
  for (const item of pack) {
    if (!productsCode.includes(item.productId)) {
      const returnProduct: ReturnProduct = {
        ...getProductById(products, item.packId),
        error: [
          'Há uma atualização de preço de pacotes sem atualização de preço de produtos.',
        ],
      };
      if (!checkDuplicateReturnProduct(returnProducts, item.packId)) {
        returnProducts.push(returnProduct);
      }
    } else {
      const returnProduct: ReturnProduct = {
        ...getProductById(products, item.productId),
      };
      returnProducts.push(returnProduct);
    }
  }
  return returnProducts;
};

export const arrayIsNotEmpty = (array: any[]) => {
  return array.length !== 0;
};

export const checkPackPrice = (
  packs: Packs[],
  updateData: UpdatePriceDto[],
  products: Product[],
): ReturnProduct => {
  let amount = 0;
  for (const pack of packs) {
    const product = updateData
      .filter((data) => data.productCode === pack.packId)
      .at(0);

    const productPrice = product.newPrice;
    const result = productPrice;
    amount = amount + result;
  }

  const pack = updateData
    .filter((data) => data.productCode === packs.at(0).packId)
    .at(0);

  const product = products
    .filter((product) => product.code === pack.productCode)
    .at(0);

  if (amount !== pack.newPrice) {
    const productFormatted = getProductById(products, product.code);
    return {
      ...productFormatted,
      newPrice: pack.newPrice,
      error: ['O pacote cuja soma dos produtos não estão condizentes.'],
    };
  }
  return;
};
