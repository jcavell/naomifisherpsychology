import { getDiscountedDisplayPrice } from "../../scripts/coupon/couponApplier";
import { useStore } from "@nanostores/react";
import { persistentCoupon } from "../../scripts/coupon/couponStore";
import { useClientOnly } from "../../scripts/basket/use-client-only-hook.ts";

interface DiscountedPriceProps {
  offerId: string;
  priceInPence: number;
}

export const DiscountedPrice: React.FC<DiscountedPriceProps> = ({
  offerId,
  priceInPence,
}) => {
  const isClient = useClientOnly();
  const couponCode = useStore(persistentCoupon);

  // During server-side rendering, show the original price
  if (!isClient) {
    return `£${(priceInPence / 100).toFixed(2)}`;
  }

  return getDiscountedDisplayPrice(couponCode, offerId, priceInPence);
};