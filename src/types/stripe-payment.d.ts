import type { BasketItem, BasketItemSummary } from "./basket-item";

export type StripePayment = {
  user_id: bigint;
  stripe_payment_id: string; // Matches the 'stripe_payment_id' column
  payment_authorised_timestamp?: string; // ISO time, matches 'payment_authorised_timestamp'
  payment_method?: string; // Credit card, bank transfer, etc. Matches 'payment_type'
  payment_amount_pence: number; // Matches 'payment_amount_pence' column
  payment_confirmed: boolean;
  items: BasketItemSummary[];
  coupon_code?: string;
  t?:string;
};
