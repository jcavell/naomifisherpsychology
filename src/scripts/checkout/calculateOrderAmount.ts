import type {BasketItem} from "../../types/basket-item";

export default function calculateOrderAmount(items: BasketItem[]): number {
  return items.reduce((total, item) => {
    return total + item.discountedPriceInPence;
  }, 0);
}
