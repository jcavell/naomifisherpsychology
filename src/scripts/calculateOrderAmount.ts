import type { LineItem } from "../types/LineItem.d.ts";

export default function calculateOrderAmount(items: LineItem[]): number {
  return items.reduce((total, item) => {
    return total + item.unit_amount;
  }, 0);
}
