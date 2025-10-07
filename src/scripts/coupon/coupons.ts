import type {Coupon} from "../../types/coupon";

export const coupons: Coupon[] = [
    {
        name: "SELECTED50",
        discountPercent: 50,
        couponInfoText: "50% OFF",
        validFrom: new Date("2025-07-01T00:00:00Z").getTime(),
        validUntil: new Date("2026-08-31T23:59:59Z").getTime(),
        applicableOfferIDs: ["veqRLt2E"], // Anxiety a guide for teenagers
    },
    {
        name: "JC",
        discountPercent: 99,
        couponInfoText: "99% OFF",
        validFrom: new Date("2025-08-01T00:00:00Z").getTime(),
        validUntil: new Date("2028-08-31T23:59:59Z").getTime(),
        applicableOfferIDs: ["1472494212829", "veqRLt2E", "3qPhcXAK", "9mEzpCdy", "52TX3LQu", "cspb95bK", "UgeLqYii", "mnoaNY87", "RyCi7fGT"], // Anxiety a guide for teenagers and Helping your teen with anxiety
    }
];

export const isCouponCodeValid = (couponCode: string) => {
    const coupon = coupons.find((c) => c.name === couponCode);

    // No coupon found
    if(!coupon) return false;

    // Coupon found - check it is active
    const now = new Date().getTime();
    return now >= coupon.validFrom;
};

export const isCouponCodeExpired = (couponCode: string) => {
    const coupon = coupons.find((c) => c.name === couponCode);

    // No coupon found - say it's expired
    if(!coupon) return true;

    const now = new Date().getTime();
    return now > coupon.validUntil;
};
