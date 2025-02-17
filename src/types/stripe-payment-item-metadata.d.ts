export type StripePaymentItemMetadata = {
  id: string;
  product_id: string;
  price: number;
  currency: string;
  quantity: number;
  product_type: product_type;
  product_name: string;
  variant_id: string;
  vatable: boolean;
};
