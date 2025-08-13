import type { BasketItem } from "./basket-item..ts";

export type Purchase = {
  first_name: string;
  surname: string;
  email: string;
  total: string; // formatted, e.g. £16.99
  stripe_payment_id: string; // 'FREE' if all items are free
  purchase_date: string;
  items: BasketItem[];
};
