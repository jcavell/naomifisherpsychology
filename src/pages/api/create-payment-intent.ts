import { stripe } from "./init-stripe.ts";
import calculateOrderAmount from "../../scripts/calculateOrderAmount.ts";
import type { BasketItem } from "../../types/basket-item";
import type { StripePaymentItemMetadata } from "../../types/stripe-payment-item-metadata";

export const prerender = false;

export async function POST({ params, request }) {
  const rawBody = await request.text();
  // console.log("Full raw request body: ", rawBody);

  const json = JSON.parse(rawBody); // Safely parse the raw body as JSON
  // console.log("Parsed request body (as JSON): ", json);

  const { items } = json as { items: BasketItem[] };
  const itemsMetadata: StripePaymentItemMetadata[] = items.map(
    ({
      product_id,
      variant_id,
      quantity,
      currency,
      product_name,
      variant_name,
      added_at,
      variant_description,
      product_description,
      product_images,
      expires_at,
      ...rest
    }) => rest,
  );

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

  return new Response(
    JSON.stringify({
      clientSecret: paymentIntent.client_secret,
    }),
  );
}
