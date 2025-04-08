import type { Item } from "react-use-cart";

export default function calculateOrderAmount(items: Item[]): number {
  return items.reduce((total, item) => {
    return total + item.price;
  }, 0);
}
