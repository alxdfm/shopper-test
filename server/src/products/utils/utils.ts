import { ReturnProduct } from '../dto/products.dto';
import { Packs } from '../entities/packs.entity';
import { Product } from '../entities/product.entity';

export const getProductById = (
  products: Product[],
  id: number,
): ReturnProduct => {
  const product = products.filter((product) => product.code === id).at(0);
  return {
    code: product.code,
    name: product.name,
    currentPrice: product.salesPrice,
  };
};

export const getProductsCode = (updateData): number[] => {
  const array = [];
  for (const item of updateData) {
    array.push(item.productCode);
  }
  return array;
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

export const checkDuplicateReturnProduct = (
  arrayProduct: ReturnProduct[],
  code: number,
): boolean => {
  return !!arrayProduct.filter((product) => product.code === code).at(0);
};
