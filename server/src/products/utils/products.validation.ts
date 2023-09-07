export const salesGreaterCost = (sales_price: number, cost_price: number) => {
  return sales_price > cost_price;
};

export const maxReajustPrice = (
  percentage: number,
  oldPrice: number,
  newPrice: number,
) => {
  const maxReajustDiff = (percentage / 100) * oldPrice;
  return maxReajustDiff < Math.abs(newPrice - oldPrice);
};
