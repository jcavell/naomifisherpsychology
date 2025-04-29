import { stripe } from "../../scripts/checkout/init-stripe.ts";
import calculateOrderAmount from "../../scripts/checkout/calculateOrderAmount.ts";
import type { BasketItem } from "../../types/basket-item";
import type { StripePaymentItemMetadata } from "../../types/stripe-payment-item-metadata";
import Logger from "../../scripts/logger.ts";

export const prerender = false;

export async function POST({ params, request }) {

  Logger.INFO("***** API: POST /create-payment-intent", params);

  const rawBody = await request.text();
  // console.log("Full raw request body: ", rawBody);

  const json = JSON.parse(rawBody); // Safely parse the raw body as JSON
  // console.log("Parsed request body (as JSON): ", json);

  const { items } = json as { items: BasketItem[] };
  const itemsMetadata = items.map((item) => ({
    id: item.id,
    product_type: item.product_type,
    price: item.price,
  }));

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "gbp",
    metadata: { items: JSON.stringify(itemsMetadata) },
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  Logger.INFO("***** Created a payment intent: ", {'pi' : paymentIntent.client_secret});

  return new Response(
    JSON.stringify({
      clientSecret: paymentIntent.client_secret,
    }),
  );
}
