import type { BasketItem } from "../../types/basket-item";
import { persistentCoupon } from "../coupon/couponStore";

export type ItemType = "webinar" | "course";

export const fetchItemFromAPI = async (
    id: string,
    type: ItemType,
): Promise<BasketItem | undefined> => {
    try {
        const couponCode = persistentCoupon.get();
        const baseEndpoint = type === "course"
            ? `/api/courses/${id}`
            : `/api/webinar-tickets/${id}`;

        const endpoint = couponCode
            ? `${baseEndpoint}?cocd=${couponCode}`
            : baseEndpoint;

        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.error("Error fetching item:", err);
    }
};