import type { LineItem } from "./LineItem.ts";

export default function calculateOrderAmount(items: LineItem[]): number {
  return items.reduce((total, item) => {
    return total + item.unit_amount;
  }, 0);
}
