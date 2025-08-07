import { getDiscountedDisplayPrice } from "../../scripts/coupon/couponApplier";
import { useStore } from "@nanostores/react";
import { persistentCoupon } from "../../scripts/coupon/couponStore";

interface DiscountedPriceProps {
  offerId: string;
  priceInPence: number;
}

export const DiscountedPrice: React.FC<DiscountedPriceProps> = ({
  offerId,
  priceInPence,
}) => {
  const couponCode = useStore(persistentCoupon);
  return getDiscountedDisplayPrice(couponCode, offerId, priceInPence);
};