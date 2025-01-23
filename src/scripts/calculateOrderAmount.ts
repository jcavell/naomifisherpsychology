type MinimalLineItem = {
  price_data?: {
    currency: string;
    product_data?: {
      name: string;
      description?: string;
    };
    unit_amount?: number;
  };
};

export default function calculateOrderAmount(items: MinimalLineItem[]): number {
  return items.reduce((total, item) => {
    // Safely access price_data and unit_amount, defaulting to 0 if undefined
    return total + (item.price_data?.unit_amount ?? 0);
  }, 0);
}
