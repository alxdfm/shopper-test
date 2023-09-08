import { ReturnProduct, UpdatePriceDto } from '../dto/products.dto';
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

export const checkDuplicateReturnProduct = (
  arrayProduct: ReturnProduct[],
  code: number,
): boolean => {
  return !!arrayProduct.filter((product) => product.code === code).at(0);
};

export const assignNewValueToProduct = (
  products: ReturnProduct[],
  updatePrices: UpdatePriceDto[],
): ReturnProduct[] => {
  const returnProducts: ReturnProduct[] = [];
  for (const product of products) {
    for (const updatePrice of updatePrices) {
      if (product.code === updatePrice.productCode) {
        returnProducts.push({ ...product, newPrice: updatePrice.newPrice });
      }
    }
  }
  return returnProducts;
};

export const mergeErrors = (
  oldResults: ReturnProduct[],
  newResults: ReturnProduct[],
): ReturnProduct[] => {
  const updatedResult = [];
  for (const oldResult of oldResults) {
    for (const newResult of newResults) {
      console.log(newResult);
      for (const error of newResult.error) {
        if (!oldResult.error.includes(error)) {
          const currentResult: ReturnProduct = {
            ...oldResult,
          };
          currentResult.error.push(error);
          updatedResult.push(currentResult);
        } else {
          updatedResult.push(oldResult);
        }
      }
    }
  }

  return updatedResult;
};

export const addError = (
  product: Product,
  newPrice: number,
  returnProducts: ReturnProduct[],
  errorMessage: string,
): ReturnProduct => {
  const getReturnProductById = returnProducts
    .filter((prod) => prod.code === product.code)
    .at(0);

  if (!getReturnProductById) {
    return {
      ...getProductById([product], product.code),
      newPrice,
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
