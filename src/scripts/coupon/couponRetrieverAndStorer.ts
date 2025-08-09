import { persistentCoupon } from "./couponStore";

function getCouponCodeFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("cocd");
}

export function persistCouponFromURL() {
  const couponCode = getCouponCodeFromURL()

  // Only persist coupon code if it is not null or empty
  if (couponCode) {
    persistentCoupon.set(couponCode);
  }
}

export function removeCouponCodeFromStore() {
  persistentCoupon.set("");
}

export function getCouponCodeFromStore() {
  return persistentCoupon.get();
}