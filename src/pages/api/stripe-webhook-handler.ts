import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "./init-stripe.ts";
import type { StripePayment } from "../../types/stripe-payment";

export const prerender = false; // Disable static pre-rendering for this endpoint

const supabase = createClient(
  import.meta.env.SUPABASE_API_URL,
  import.meta.env.SUPABASE_API_KEY,
);

export async function POST({ request }: { request: Request }) {
  console.log("Received Stripe webhook");

  const sig = request.headers.get("stripe-signature");
  let event;

  try {
    const bodyBuffer = await request.text(); // Raw request body
    event = stripe.webhooks.constructEvent(
      bodyBuffer,
      sig!,
      import.meta.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (
    event.type === "payment_intent.succeeded" ||
    event.type === "charge.updated"
  ) {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log("Payment Intent:", paymentIntent);

    try {
      // Update purchase with payment method, timestamp and confirm the purchase
      const { error: updateError } = await supabase
        .from("Purchases")
        .update({
          payment_amount_pence: paymentIntent.amount,
          payment_method: paymentIntent.payment_method?.toString(),
          payment_confirmed: true,
          payment_authorised_timestamp: new Date(
            paymentIntent.created * 1000,
          ).toISOString(),
        })
        .eq("stripe_payment_id", paymentIntent.id);

      if (updateError) {
        throw new Error(
          `Failed to upsert purchase record: ${updateError.message}`,
        );
      }

      console.log("Purchase record successfully updated.");
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    } catch (err) {
      console.error("Error handling payment_intent.succeeded:", err);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  // Handle other unprocessed event types
  console.log(`Unhandled event type: ${event.type}`);
  return new Response("Event not handled", { status: 400 });
}
