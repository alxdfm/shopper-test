import { UpdatePriceDto } from '../dto/update-price.dto';
import { Packs } from '../entities/packs.entity';

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

export const packIncludesProduct = (pack: Packs[], productsCode: number[]) => {
  for (const item of pack) {
    if (!productsCode.includes(item.productId)) {
      return false;
    }
  }
  return true;
};

export const arrayIsNotEmpty = (array: any[]) => {
  return array.length !== 0;
};

export const removeDuplicated = (packs: Packs[]) => {
  const set = new Set();
  const filter = packs.filter((pack) => {
    const duplicate = set.has(pack.packId);
    set.add(pack.packId);
    return !duplicate;
  });
  return filter;
};

export const checkPackPrice = (
  packs: Packs[],
  updateData: UpdatePriceDto[],
) => {
  let amount = 0;
  for (const pack of packs) {
    const product = updateData
      .filter((data) => data.productCode === pack.productId)
      .at(0);
    const productPrice = product.newPrice;
    const result = productPrice;
    amount = amount + result;
  }

  const packPrice = updateData
    .filter((data) => data.productCode === packs.at(0).packId)
    .at(0).newPrice;
  return amount === packPrice;
};
