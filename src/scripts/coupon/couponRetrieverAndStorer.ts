import { persistentCoupon } from "./couponStore";
import { autoCoupon, isCouponCodeValid } from "./coupons.ts";

// How long a user's explicit removal suppresses the auto coupon.
const AUTO_COUPON_SUPPRESSION_MS = 24 * 60 * 60 * 1000; // 24 hours

function getCouponCodeFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("cocd");
}

export function persistCouponFromURLOrAuto() {
  const stored = persistentCoupon.get();
  const urlCoupon = getCouponCodeFromURL();

  // 1. URL coupon always wins
  if (urlCoupon && isCouponCodeValid(urlCoupon) && stored?.code !== urlCoupon) {
    persistentCoupon.set({
      code: urlCoupon,
      source: "url",
      timestamp: Date.now(),
    });
    return;
  }

  // 2. Respect explicit removal within the suppression window
  if (stored?.source === "removed") {
    const suppressedAt = stored.timestamp ?? 0;
    if (Date.now() - suppressedAt < AUTO_COUPON_SUPPRESSION_MS) return;
  }

  // 3. Handle any other stored coupon
  else if (stored) {
    if (isCouponCodeValid(stored.code)) return;
    removeCouponCodeFromStore();
  }

  // 4. Apply auto coupon (cases: null, suppression expired, invalid code cleared)
  if (isCouponCodeValid(autoCoupon)) {
    persistentCoupon.set({
      code: autoCoupon,
      source: "auto",
      timestamp: Date.now(),
    });
  }
}

export function removeCouponCodeFromStore() {
  persistentCoupon.set({
    code: "",
    source: "removed",
    timestamp: Date.now(),
  });
}

export function getCouponCodeFromStore() {
  return persistentCoupon.get();
}
