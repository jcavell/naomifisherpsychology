import type {Coupon} from "../../types/coupon";

export const coupons: Coupon[] = [
    {
        name: "SCHOOL2026",
        discountPercent: 50,
        couponInfoText: "50% OFF",
        validFrom: new Date("2025-07-01T00:00:00Z").getTime(),
        validUntil: new Date("2026-04-05T23:59:59Z").getTime(),
        applicableOfferIDs: ["C746RNzF", "xvn8Y7TJ", "XgLDdAFa", "vV8BeUKS", "jLbWvRoa", "NzaULaoT", "mnoaNY87", "RyCi7fGT", "EzLuffn4", "CXNPs8L3", "qRTfapFL"], // School and Education
    },
    {
        name: "ABC",
        discountPercent: 99,
        couponInfoText: "55% OFF",
        validFrom: new Date("2025-07-01T00:00:00Z").getTime(),
        validUntil: new Date("2026-04-27T23:59:59Z").getTime(),
        applicableOfferIDs: ["qRTfapFL"],
    }
];

// Set any automatically applied coupon e.g. for a sale here
export const autoCoupon = "SCHOOL2026";

export const getCouponFromCode = (couponCode: string) =>  coupons.find((c) => c.name === couponCode);

export const isCouponCodeValid = (couponCode: string) => {
    const coupon = getCouponFromCode(couponCode);

    // No coupon found
    if(!coupon) return false;

    // Coupon found - check it hasn't expired
    const now = new Date().getTime();
    return now >= coupon.validFrom && now <= coupon.validUntil;
};
