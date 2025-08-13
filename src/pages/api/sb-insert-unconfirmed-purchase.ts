import type { User } from "../../types/user";
import type { StripePayment } from "../../types/stripe-payment";
import type { BasketItem, BasketItemSummary } from "../../types/basket-item..ts";
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
      coupon_code,
      t,
    }: {
      payment_intent_id: string;
      user: User;
      basket_items: BasketItem[];
      coupon_code;
      t;
    } = body;

    console.log(
      "***sb-insert-unconfirmed-purchase POST:",
      JSON.stringify(body),
    );

    // Validate paymentIntentId, user object, and getBasketItems array
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

    const basketItemsSummary = basket_items.map((item) => ({
      id: item.id,
      couponCode: item.couponCode,
      originalPriceInPence: item.originalPriceInPence,
      discountedPriceInPence: item.discountedPriceInPence,
      currency: item.currency,
      quantity: item.quantity,
      product_type: item.product_type,
      is_course: item.is_course,
      is_webinar: item.is_webinar,
      product_id: item.product_id,
      product_name: item.product_name,
      variant_id: item.variant_id,
      variant_name: item.variant_name,
      vatable: item.vatable,
    }));

    const userId = upsertedUser.id;
    const stripePayment: StripePayment = {
      stripe_payment_id: payment_intent_id,
      payment_amount_pence: 0,
      items: basketItemsSummary,
      user_id: userId,
      payment_confirmed: false,
      coupon_code: coupon_code,
      t: t,
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
