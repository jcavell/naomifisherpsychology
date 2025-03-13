export type product_type = "webinar" | "course";

export type BasketItem = {
  id: string; //
  price: number; // in pence e.g. 1699
  currency: string;
  formatted_price: string; // e.g. £16.99, required by postmark template
  quantity: number;
  product_type: product_type;
  is_course: boolean; // required by postmark template
  is_webinar: boolean; // required by postmark template
  product_id: string;
  product_name: string;
  product_images: string[];
  product_description?: string;
  variant_id: string;
  variant_name: string;
  variant_description?: string;
  added_at: string;
  expires_at: string;
  vatable: boolean;
};
