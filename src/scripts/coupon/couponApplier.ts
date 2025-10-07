import type { Coupon } from "../../types/coupon";
import { coupons } from "./coupons";

export enum CouponValidationStatus {
  EMPTY_COUPON = "EMPTY_COUPON",
  NO_SUCH_COUPON = "NO_SUCH_COUPON",
  COUPON_EXPIRED = "COUPON_EXPIRED",
  COUPON_NOT_VALID_FOR_OFFER = "COUPON_NOT_VALID_FOR_OFFER",
  VALID = "VALID",
}

type CouponResult = {
  status: CouponValidationStatus;
  coupon: Coupon | null;
};

export const findValidCoupon = (couponCode: string | null, offerId: string) => {
  const result: CouponResult = {
    status: CouponValidationStatus.VALID,
    coupon: null,
  };

  if (!couponCode) {
    result.status = CouponValidationStatus.EMPTY_COUPON;
  } else {
    const coupon = coupons.find((c) => c.name === couponCode);

    if (!coupon) {
      result.status = CouponValidationStatus.NO_SUCH_COUPON;
    } else if (!coupon.applicableOfferIDs.includes(offerId)) {
      result.status = CouponValidationStatus.COUPON_NOT_VALID_FOR_OFFER;
    } else {
      // Check dates
      const now = new Date();
      const validFrom = new Date(coupon.validFrom);
      const validUntil = new Date(coupon.validUntil);

      if (now < validFrom || now > validUntil) {
        result.status = CouponValidationStatus.COUPON_EXPIRED;
      } else {
        // All good
        result.coupon = coupon;
      }
    }
  }
  return result;
};

const calculateDiscountedPriceInPence = (
  originalPriceInPence: number,
  coupon: Coupon | null,
) => {
  if (!coupon) {
    return originalPriceInPence;
  }
  const discountAmount = (originalPriceInPence * coupon.discountPercent) / 100;
  return originalPriceInPence - discountAmount;
};

export const getDiscountedDisplayPrice = (
  couponCode: string | null,
  offerId: string,
  originalPriceInPence: number,
) => {
  const originalDisplayPrice = `£${(originalPriceInPence / 100).toFixed(2)}`;
  const result = findValidCoupon(couponCode, offerId);

  if (result.status != CouponValidationStatus.VALID) {
    return originalDisplayPrice;
  }

  const coupon = result.coupon!;

  const discountedPriceInPence = calculateDiscountedPriceInPence(
    originalPriceInPence,
    coupon,
  );

  return `£${(discountedPriceInPence / 100).toFixed(2)} (${coupon.couponInfoText})`;
};

export const getDiscountedPriceInPence = (
  couponCode: string | null,
  offerId: string,
  originalPriceInPence: number,
) => {
  console.log(
    "Getting discounted price for " +
      offerId +
      " with coupon " +
      couponCode +
      " and original price " +
      originalPriceInPence +
      "",
  );
  const result = findValidCoupon(couponCode, offerId);

  if (result.status != CouponValidationStatus.VALID) {
    console.log("Coupon not valid");
    return originalPriceInPence;
  }
  const coupon = result.coupon!;
  console.log(
    "Coupon valid, discounted price is ",
    calculateDiscountedPriceInPence(originalPriceInPence, coupon),
  );

  return calculateDiscountedPriceInPence(originalPriceInPence, coupon);
};
