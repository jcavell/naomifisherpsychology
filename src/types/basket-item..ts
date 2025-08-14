export const PRODUCT_TYPE = {
  WEBINAR: "webinar",
  COURSE: "course"
} as const;

// Define the type based on the values of the constant
export type ProductType = typeof PRODUCT_TYPE[keyof typeof PRODUCT_TYPE];

export type BasketItem = {
  id: string;
  couponCode: null | string;
  originalPriceInPence: number;  // Pre-coupon in pence, e.g. 4000
  discountedPriceInPence: number; // Post-coupon in pence e.g. 2000
  currency: string; // E.g. GBP. Not currently used
  quantity: number;
  product_type: ProductType;
  is_course: boolean; // required by postmark template
  is_webinar: boolean; // required by postmark template
  product_id: string;
  product_name: string;
  product_images: string[];
  product_description?: string;
  variant_id: string;
  variant_name: string;
  variant_description?: string;
  added_at: string; // format "2025-02-13T14:42:52.713Z"
  expires_at: string; // format "2024-09-23T12:30:00Z"
  vatable: boolean;
};


export type BasketItemSummary = {
  id: string;
  couponCode: null | string;
  originalPriceInPence: number;  // Pre-coupon in pence, e.g. 4000
  discountedPriceInPence: number; // Post-coupon in pence e.g. 2000
  currency: string; // E.g. GBP. Not currently used
  quantity: number;
  product_type: ProductType;
  is_course: boolean; // required by postmark template
  is_webinar: boolean; // required by postmark template
  product_id: string;
  product_name: string;
  variant_id: string;
  variant_name: string;
  vatable: boolean;
};
