import { stripe } from "../../scripts/checkout/init-stripe.ts";
import calculateOrderAmount from "../../scripts/checkout/calculateOrderAmount.ts";
import type { BasketItem } from "../../types/basket-item";
import Logger from "../../scripts/logger.ts";
import { fetchItemFromAPI } from "../../scripts/basket/getCourseOrWebinarFromAPI.ts";

export const prerender = false;

const generatePid = (): string => {
  // Get current timestamp in base36
  const timestamp = Date.now().toString(36);
  // Get 3 random chars (base36)
  const random = Math.random().toString(36).substring(2, 5);
  return `${timestamp}${random}`;
  // Example output: "lrpzd2x" (around 7 chars)
};

export async function POST({ params, request }) {
  Logger.INFO("***** API: POST /create-payment-intent", params);

  const rawBody = await request.text();
  // console.log("Full raw request body: ", rawBody);

  const json = JSON.parse(rawBody); // Safely parse the raw body as JSON
  // console.log("Parsed request body (as JSON): ", json);

  const { items } = json as { items: BasketItem[] };

  // Validate prices against API
  try {
    for (const item of items) {
      const apiItem = await fetchItemFromAPI(
        item.product_id,
        item.product_type,
        item.couponCode,
        new URL(request.url).origin
      );

      if (!apiItem) {
        return new Response(
          JSON.stringify({
            error: "Failed to validate item prices",
          }),
          { status: 400 },
        );
      }

      if (apiItem.discountedPriceInPence !== item.discountedPriceInPence) {
        return new Response(
          JSON.stringify({
            error: "Price mismatch detected. Please refresh your cart.",
          }),
          { status: 400 },
        );
      }
    }



    // Concise metadata for Stripe has: id, t (product_type), p (price) and c (coupon) if it was applied
    const itemsMetadata = items.map((item) => ({
      id: item.id,
      t: item.product_type === "course" ? "c" : "w",
      p: item.discountedPriceInPence,
      ...(item.couponCode && item.discountedPriceInPence < item.originalPriceInPence && { c: item.couponCode }),
    }));

    // Create a PaymentIntent with the order amount and currency
    // Metadata has an internal paymentId (pid) for tracking, and items
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "gbp",
      metadata: { pid: generatePid(), items: JSON.stringify(itemsMetadata) },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    Logger.INFO("***** Created a payment intent: ", { pi: paymentIntent.client_secret});

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
      }),
    );
  } catch (error) {
    Logger.ERROR("Error in create-payment-intent:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request",
      }),
      { status: 500 },
    );
  }
}
