import type { BasketItem } from "../../types/basket-item";
import { persistentCoupon } from "../coupon/couponStore";

export type ItemType = "webinar" | "course";

export const fetchItemFromAPI = async (id: string, type: ItemType, couponCode: string | null, origin: string | null
): Promise<BasketItem | undefined> => {
    try {
        const endpoint = type === "course"
          ? `/api/courses/${id}`
          : `/api/webinar-tickets/${id}`;

        const endpointWithCouponCode = couponCode
          ? `${endpoint}?cocd=${couponCode}`
          : endpoint;

        const requestUrl = origin ? `${origin}${endpointWithCouponCode}` : endpointWithCouponCode;

        const response = await fetch(requestUrl);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.error("Error fetching item:", err);
    }
};

export const clientFetchItemFromAPI = async (id: string, type: ItemType,
): Promise<BasketItem | undefined> => {
    const couponCode= persistentCoupon.get();
    return fetchItemFromAPI(id, type, couponCode, null);
};