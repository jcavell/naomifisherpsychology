import calculateOrderAmount from "../../scripts/checkout/calculateOrderAmount.ts";
import type { BasketItem } from "../../types/basket-item..ts";
import { fetchItemFromAPI } from "../../scripts/basket/getCourseOrWebinarFromAPI.ts";

export const prerender = false;

export const validatePrices = async (items: BasketItem[], origin: string): Promise<boolean> => {
  try {
    for (const item of items) {
      const apiItem = await fetchItemFromAPI(
        item.product_id,
        item.product_type,
        item.couponCode,
        origin
      );

      if (!apiItem || apiItem.discountedPriceInPence !== item.discountedPriceInPence) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
};

// Concise metadata for Stripe has: id, t (ProductType), p (price) and c (coupon) if it was applied
export const prepareItemsMetadata = (items:BasketItem[]) =>{
  return items.map((item) => ({
    id: item.id,
    t: item.product_type === "course" ? "c" : "w",
    p: item.discountedPriceInPence,
    ...(item.couponCode && item.discountedPriceInPence < item.originalPriceInPence && { c: item.couponCode }),
  }));
}

export const generatePid = (): string => {
  // Get current timestamp in base36
  const timestamp = Date.now().toString(36);
  // Get 3 random chars (base36)
  const random = Math.random().toString(36).substring(2, 5);
  return `${timestamp}${random}`;
  // Example output: "lrpzd2x" (around 7 chars)
};