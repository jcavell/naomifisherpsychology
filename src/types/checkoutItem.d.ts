export type product_type = "webinar" | "course";

export type CheckoutItem = {
  id: string; //
  price: number; // in pence
  currency: string;
  quantity: number;
  product_type: product_type;
  product_id: string;
  product_name: string;
  product_images: string[];
  product_description?: string;
  variant_id: string;
  variant_name: string;
  variant_description?: string;
  expires_at: string;
};
