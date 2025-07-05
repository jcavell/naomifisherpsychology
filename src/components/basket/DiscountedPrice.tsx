import React, { useEffect, useState } from 'react';
import { getCouponCodeFromRequestOrLS, getDiscountedDisplayPrice } from "../../scripts/coupon/couponApplier";

interface DiscountedPriceProps {
  offerId: string;
  priceInPence: number;
}

export const DiscountedPrice: React.FC<DiscountedPriceProps> = ({ offerId, priceInPence }) => {
  const [price, setPrice] = useState(`£${(priceInPence / 100).toFixed(2)}`);

  useEffect(() => {
    const discountedPrice = getDiscountedDisplayPrice(
      getCouponCodeFromRequestOrLS(),
      offerId,
      priceInPence
    );
    setPrice(discountedPrice);
  }, [offerId, priceInPence]);

  return price;
};