import type {BasketItem} from "../../../types/basket-item.ts";
import {getCourseByOfferId} from "../../../scripts/courses";
import { getDiscountedDisplayPrice, getDiscountedPriceInPence } from "../../../scripts/coupon/couponApplier.ts";
import type { APIContext } from 'astro';


export const prerender = false;

const now = new Date();
const oneYearFromNow = new Date(now.setFullYear(now.getFullYear() + 1));

export async function GET({params, request}: APIContext) {
    const url = new URL(request.url);
    const offerId = params.offerId; // Get offerId from route params
    const cocd = url.searchParams.get('cocd'); //  cocd may be present in query string

    if (!offerId) {
        return new Response("Offer ID is required", {
            headers: {"Content-Type": "application/json"},
            status: 400,
        });
    }

    const course = await getCourseByOfferId(offerId);

    if (!course) {
        return new Response("Course not found", {
            headers: {"Content-Type": "application/json"},
            status: 404,
        });
    }

    const originalPriceInPence = course.data.priceInPence!;
    const discountDisplayPrice = getDiscountedDisplayPrice(cocd, offerId, originalPriceInPence);
    const discountedPriceInPence = getDiscountedPriceInPence(cocd, offerId, originalPriceInPence);

    const checkoutItem: BasketItem = {
        id: offerId,
        couponCode: cocd, // could be null
        product_type: "course",
        is_course: true,
        is_webinar: false,
        product_id: offerId,
        product_name: course.data.title,
        product_description: course.data.description,
        product_images: [course.data.imageURL],
        variant_id: "", // courses have no variant
        variant_name: "Recorded course",
        originalPriceInPence: originalPriceInPence, // pre-coupon
        discountedPriceInPence: discountedPriceInPence, // post-coupon
        added_at: new Date().toISOString(),
        expires_at: oneYearFromNow.toISOString(),
        quantity: 1,
        vatable: false,
        currency: "GBP", // Assuming GBP is default
    };

    return new Response(JSON.stringify(checkoutItem), {
        headers: {"Content-Type": "application/json"},
        status: 200,
    });
}


