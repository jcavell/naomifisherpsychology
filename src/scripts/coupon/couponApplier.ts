import type {CouponDataInLocalStorage} from "../../types/coupon";
import {coupons} from "./coupons";

export const getDiscountedDisplayPrice = (couponCode: string | null, offerId: string, originalPriceInPence: number) => {

    const originalDisplayPrice =  `£${(originalPriceInPence / 100).toFixed(2)}`;

    if (!couponCode) return originalDisplayPrice;

    const coupon = coupons.find(c => c.name === couponCode && c.applicableOfferIDs.includes(offerId));
    if (!coupon) return originalDisplayPrice;

    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (now >= validFrom && now <= validUntil) {
        // Apply the coupon
        const discountedPriceInPence =  (originalPriceInPence * coupon.discountPercent / 100);

        // Format the output
        return `£${(discountedPriceInPence / 100).toFixed(2)} (${coupon.couponInfoText})`;
    }

    // Not in current time period
    return originalDisplayPrice;

}

export const getDiscountedPriceInPence = (couponCode: string | null, offerId: string, originalPriceInPence: number) => {
    if (!couponCode) return originalPriceInPence;

    const coupon = coupons.find(c => c.name === couponCode && c.applicableOfferIDs.includes(offerId));
    if (!coupon) return originalPriceInPence;

    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (now >= validFrom && now <= validUntil) {
        // Apply the coupon
        return  (originalPriceInPence * coupon.discountPercent / 100);
    }

    // Not in current time period
    return originalPriceInPence;
}

export const getCouponCodeFromRequestOrLS = () => {

    console.log("Attempting to get coupon code from URL and then LS");
    // Check URL params first
    const urlParams = new URLSearchParams(window.location.search);
    const urlCouponCode = urlParams.get('cocd');
    if (urlCouponCode) {
        return urlCouponCode;
    }

    // Then check localStorage
    const storedCoupon = localStorage.getItem('cocd');
    if (!storedCoupon) return null;

    const couponData: CouponDataInLocalStorage = JSON.parse(storedCoupon);
    const now = new Date().getTime();

    if (now > couponData.expires) {
        localStorage.removeItem('cocd');
        return null;
    }

    console.log("cocd: " + couponData.code);
    return couponData.code;
};