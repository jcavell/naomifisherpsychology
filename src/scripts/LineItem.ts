export type LineItem = {
  currency: string;
  unit_amount: number;
  quantity: number;
  product_data: {
    id: string;
    name: string;
    description?: string;
    images: string[];
  };
};
