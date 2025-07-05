export type Coupon = {
    name: string;
    discountPercent: number;
    couponInfoText: string;
    validFrom: string; // ISO 8601 string
    validUntil: string; // ISO 8601 string
    applicableOfferIDs: string[];
};

export type CouponDataInLocalStorage =
    { code: string, expires: number }

