import { createClient } from "@supabase/supabase-js";
import { stripe } from "./init-stripe.ts";
import type { User } from "../../types/user";
import type { StripePayment } from "../../types/stripe-payment";

export const prerender = false;

const supabase = createClient(
  import.meta.env.SUPABASE_API_URL,
  import.meta.env.SUPABASE_API_KEY,
);

export async function POST({ request }: { request: Request }) {
  try {
    // Parse the incoming request body
    const body = await request.json();
    const { paymentIntentId, user }: { paymentIntentId: string; user: User } =
      body;

    // Validate paymentIntentId and user object
    if (!paymentIntentId || !user || !user.email) {
      return new Response(
        JSON.stringify({ error: "Invalid request. Missing required fields." }),
        {
          status: 400,
        },
      );
    }

    // Step 1: Retrieve the PaymentIntent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return new Response(
        JSON.stringify({ error: "Failed to retrieve PaymentIntent." }),
        { status: 404 },
      );
    }

    // Step 2: Extract information from PaymentIntent
    const items = paymentIntent.metadata.items
      ? JSON.parse(paymentIntent.metadata.items)
      : [];
    const payment_method = paymentIntent.payment_method;

    // Step 3: Upsert the user data into Supabase
    const { data: upsertedUser, error: upsertUserError } = await supabase
      .from("Users")
      .upsert(
        {
          first_name: user.first_name,
          surname: user.surname,
          email: user.email,
          kit_subscriber_id: user.kit_subscriber_id || null,
          subscribed_to_marketing: user.kit_subscriber_id
            ? true
            : (user.subscribed_to_marketing ?? false),
        },
        { onConflict: "email" },
      )
      .select("id")
      .single();

    if (upsertUserError) {
      console.error("Failed to upsert user:", upsertUserError);
      throw new Error(`Failed to upsert user: ${upsertUserError.message}`);
    }

    // Step 4: Insert the purchase into Supabase
    const userId = upsertedUser.id;
    const stripePayment: StripePayment = {
      stripe_payment_id: paymentIntentId,
      payment_amount_pence: paymentIntent.amount_received,
      items, // Parsed from metadata
      user_id: userId,
      payment_confirmed: false,
    };

    const { error: purchaseError } = await supabase
      .from("Purchases")
      .insert([stripePayment]);

    if (purchaseError) {
      console.error("Failed to insert purchase into Supabase:", purchaseError);
      throw new Error(`Failed to record purchase: ${purchaseError.message}`);
    }

    return new Response(
      JSON.stringify({ message: "User and purchase successfully saved." }),
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      {
        status: 500,
      },
    );
  }
}
