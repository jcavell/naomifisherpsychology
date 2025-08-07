export type Coupon = {
    name: string;
    discountPercent: number;
    couponInfoText: string;
    validFrom: number; // time
    validUntil: number; // time
    applicableOfferIDs: string[];
};

