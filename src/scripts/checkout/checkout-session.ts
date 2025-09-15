import type { BasketItem } from "../../types/basket-item..ts";

export interface CheckoutSession {
  paymentIntentId: string | null;
  basketItems: BasketItem[];
  firstName: string;
  surname: string;
  email: string;
}

export const setCheckoutSession = (checkoutId: string, checkoutSession: CheckoutSession) => {
  sessionStorage.setItem(
    `checkout_session_${checkoutId}`,
    JSON.stringify(checkoutSession)
  );
};

export const getCheckoutSession = (checkoutId: string) => {
  const session = sessionStorage.getItem(`checkout_session_${checkoutId}`);
  return session ? JSON.parse(session) as CheckoutSession : null;
};

