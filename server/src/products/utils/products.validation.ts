import { ReturnProduct, UpdatePriceDto } from '../dto/products.dto';
import { Packs } from '../entities/packs.entity';
import { getProductInfoById } from './utils';

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

export const arrayValidate = (array1: any[], array2: any[]) => {
  return array1.length !== 0 && array1.length === array2.length;
};

export const checkPackPrice = (
  packs: Packs[],
  updateData: UpdatePriceDto[],
  returnProducts: ReturnProduct[],
): ReturnProduct => {
  let productsPrice = 0;
  for (const pack of packs) {
    const product = updateData
      .filter((data) => data.productCode === pack.productId)
      .at(0);

    if (!product) {
      const filter = returnProducts
        .filter((product) => product.code === pack.packId)
        .at(0);

      const errorMessage =
        'É necessário atualizar, também, os preços dos itens inclusos neste pack.';

      filter.error.push(errorMessage);

      return filter;
    }

    productsPrice = productsPrice + product.newPrice * pack.qty;
  }

  const pack = updateData
    .filter((data) => data.productCode === packs.at(0).packId)
    .at(0);

  const productInfo = getProductInfoById(returnProducts, pack.productCode);

  if (productsPrice !== pack.newPrice) {
    const filter = returnProducts
      .filter((product) => product.code === pack.productCode)
      .at(0);

    const errorMessage =
      'A soma dos produtos presentes neste pack é diferente do valor do pack.';

    filter.error.push(errorMessage);

    return filter;
  }
  return {
    ...productInfo,
  };
};
