import { stripe } from "./init-stripe.ts";
import Stripe from "stripe";
import calculateOrderAmount from "../../scripts/calculateOrderAmount.ts";

export const prerender = false;

export async function POST({ params, request }) {
  const json = await request.json();
  console.log("JSON: " + JSON.stringify(json));

  const { items } = json;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "gbp",
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
