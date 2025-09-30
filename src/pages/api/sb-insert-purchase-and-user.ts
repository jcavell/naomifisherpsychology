import type { User } from "../../types/user";
import type {
  BasketItem,
  BasketItemSummary,
} from "../../types/basket-item.ts";
import { upsertUser } from "../../scripts/checkout/sb-users.ts";
import { createSbClient } from "../../scripts/checkout/create-sb-client.ts";
import type { APIRoute } from "astro";
import type { Purchase } from "../../types/purchase";
import type { TrackerData } from "../../scripts/tracking/trackerStore.ts";

export const prerender = false;

export interface PurchaseRequestBody {
  payment_intent_id: string;
  payment_confirmed: boolean;
  user: User;
  basket_items: BasketItem[];
  coupon_code?: string;
  tracker_data?: TrackerData;
}


const supabase = createSbClient;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Parse the incoming request body
    const body = await request.json() as PurchaseRequestBody;
    const {
      payment_intent_id,
      payment_confirmed,
      user,
      basket_items,
      coupon_code,
      tracker_data
    }: {
      payment_intent_id: string; // free_ for free purchases
      payment_confirmed: boolean; // true for free purchases
      user: User;
      basket_items: BasketItem[];
      coupon_code?: string;
      tracker_data?: TrackerData;
    } = body;

    console.log(
      "***sb-insert-purchase-and-user POST:",
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

    // Step 1: Create a unique session ID
    const sessionId = crypto.randomUUID();

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

    const purchase: Purchase = {
      session_id: sessionId,
      stripe_payment_id: payment_intent_id,
      payment_amount_pence: 0,
      items: basketItemsSummary,
      user_id: userId,
      payment_confirmed: payment_confirmed,
      coupon_code: coupon_code,
      ...(tracker_data?.trackers || {})
    };

    // Upsert used to cater for scenario of the same Stripe payment_intent_id
    // Happens if their card is declined and they try with a different card
    const { error: purchaseError } = await supabase
      .from("Purchases")
      .upsert([purchase], {
        onConflict: "stripe_payment_id",
        ignoreDuplicates: false,
      });

    if (purchaseError) {
      console.error("Failed to insert purchase into Supabase:", purchaseError);
      throw new Error(`Failed to record purchase: ${purchaseError.message}`);
    }

    // Set an HTTP-only cookie
    // This is required because info is lost if e.g. PayPal cancels
    // This keeps it persistent so it's available when redirected to enter the user details
    cookies.set("checkout_session_id", sessionId, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60, // 1 hour
      sameSite: "lax", // optional, good default
      secure: true, // set true if using HTTPS
    });

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
};
