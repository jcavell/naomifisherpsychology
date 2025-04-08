import { stripe } from "../../scripts/checkout/init-stripe.ts";

export const prerender = false;

async function getCoupon(couponId: string) {
  try {
    // Fetch the coupon from Stripe
    const coupon = await stripe.coupons.retrieve(couponId);

    // Log or process the coupon details
    console.log("Coupon Details: ", coupon);
    return coupon;
  } catch (error) {
    if (error.type === "StripeInvalidRequestError") {
      console.error("Coupon not found or invalid:", error.message);
    } else {
      console.error("Error retrieving coupon:", error);
    }
    throw error; // Rethrow the error for handling further
  }
}
