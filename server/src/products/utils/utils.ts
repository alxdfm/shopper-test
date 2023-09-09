import { ReturnProduct, UpdatePriceDto } from '../dto/products.dto';
import { Packs } from '../entities/packs.entity';
import { Product } from '../entities/product.entity';

export const getProductInfoById = (
  products: ReturnProduct[],
  id: number,
): ReturnProduct => {
  const product = products.filter((product) => product.code === id).at(0);
  return product;
};

export const getProductsCode = (updateData): number[] => {
  const array = [];
  for (const item of updateData) {
    array.push(item.productCode);
  }
  return array;
};

export const removeDuplicatedPacks = (packs: Packs[]) => {
  const set = new Set();
  const filter = packs.filter((pack) => {
    const duplicate = set.has(pack.packId);
    set.add(pack.packId);
    return !duplicate;
  });
  return filter;
};

export const removeDuplicatedReturnProducts = (
  returnProducts: ReturnProduct[],
) => {
  const set = new Set();
  const filter = returnProducts.filter((product) => {
    const duplicate = set.has(product.code);
    set.add(product.code);
    return !duplicate;
  });
  return filter;
};

export const addError = (
  product: Product,
  returnProducts: ReturnProduct[],
  errorMessage: string,
): ReturnProduct => {
  const getReturnProductById = returnProducts
    .filter((prod) => prod.code === product.code)
    .at(0);

  if (!getReturnProductById) {
    return {
      ...getProductInfoById([getReturnProductById], product.code),
      error: [errorMessage],
    };
  }

  if (!getReturnProductById.error) {
    getReturnProductById.error = [];
  }

  getReturnProductById.error.push(errorMessage);
  return getReturnProductById;
};

export const chargeProductInfos = (
  products: Product[],
  updateData: UpdatePriceDto[],
): ReturnProduct[] => {
  const charged: ReturnProduct[] = [];

  for (const product of products) {
    const newPrice = updateData
      .filter((data) => data.productCode === product.code)
      .at(0).newPrice;
    charged.push({
      code: product.code,
      currentPrice: product.salesPrice,
      name: product.name,
      newPrice,
      error: [],
    });
  }

  return charged;
};

export const extractProductIdFromPack = (array: Packs[]) => {
  const temp = [];
  for (const item of array) {
    temp.push(item.productId);
  }
  return temp;
};
