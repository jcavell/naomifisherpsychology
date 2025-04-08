import { createClient } from "@supabase/supabase-js";
import type { User } from "../../types/user";
import type { StripePayment } from "../../types/stripe-payment";
import type { BasketItem } from "../../types/basket-item";
import { upsertUser } from "../../scripts/checkout/sb-users.ts";
import { createSbClient } from "../../scripts/checkout/create-sb-client.ts";

export const prerender = false;

const supabase = createSbClient;

export async function POST({ request }: { request: Request }) {
  try {
    // Parse the incoming request body
    const body = await request.json();
    const {
      payment_intent_id,
      user,
      basket_items,
    }: { payment_intent_id: string; user: User; basket_items: BasketItem[] } =
      body;

    // Validate paymentIntentId, user object, and basketItems array
    if (
      !payment_intent_id ||
      !user ||
      !user.email ||
      !basket_items ||
      !basket_items.length
    ) {
      console.error("Invalid request. Missing required fields.", {
        payment_intent_id: payment_intent_id,
        user,
        basket_items: basket_items,
      });
      return new Response(
        JSON.stringify({
          error: "Invalid request. Missing required fields.",
        }),
        {
          status: 400,
        },
      );
    }

    // Step 1: Upsert the user data into Supabase
    const upsertedUser = await upsertUser(user);

    // Step 2: Insert the purchase into Supabase
    const userId = upsertedUser.id;
    const stripePayment: StripePayment = {
      stripe_payment_id: payment_intent_id,
      payment_amount_pence: 0,
      items: basket_items,
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
