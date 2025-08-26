import { stripe } from "../../scripts/checkout/init-stripe.ts";
import calculateOrderAmount from "../../scripts/checkout/calculateOrderAmount.ts";
import type { BasketItem } from "../../types/basket-item..ts";
import Logger from "../../scripts/logger.ts";
import { generatePid, prepareItemsMetadata, validatePrices } from "./validate-and-prepare-payment.ts";

export const prerender = false;

export async function POST({ params, request }) {
  Logger.INFO("***** API: POST /create-payment-intent", params);

  try {
    const { items } = JSON.parse(await request.text()) as { items: BasketItem[] };

    const isValid = await validatePrices(items, new URL(request.url).origin);

    if (!isValid) {
      return new Response(
        JSON.stringify({
          error: "Price mismatch detected. Please refresh your cart.",
        }),
        { status: 400 }
      );
    }

    const pid = generatePid();
    const itemsMetadata = prepareItemsMetadata(items);
    const amount = calculateOrderAmount(items);

    // Create a PaymentIntent with the order amount and currency
    // Metadata has an internal paymentId (pid) for tracking, and items
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "gbp",
      metadata: { pid, items: JSON.stringify(itemsMetadata) },
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
