export interface UpdatePriceDto {
  productCode: number;
  newPrice: number;
}

export interface ReturnProduct {
  code: number;
  name: string;
  currentPrice: number;
  newPrice?: number;
  error?: string[];
}
