import Stripe from "stripe";
import { env } from "../../scripts/env";
import { stripe } from "../../scripts/checkout/init-stripe.ts";
import Logger from "../../scripts/logger.ts";
import type { BasketItem } from "../../types/basket-item..ts";
import { insertWebinarTickets } from "../../scripts/checkout/sb-webinar-tickets.ts";
import { getUser } from "../../scripts/checkout/sb-users.ts";
import { sendPurchaseConfirmationAndSubToKit } from "../../scripts/checkout/send-purchase-confirmation.ts";
import {
  getPurchase,
  upsertPurchaseToConfirmPayment,
} from "../../scripts/checkout/sb-purchases.ts";
import { postCoursesToZapierWithRetry } from "../../scripts/checkout/zap.ts";

export const prerender = false; // Disable static pre-rendering for this endpoint

export async function POST({ request }: { request: Request }) {
  const sig = request.headers.get("stripe-signature");
  let event: Stripe.Event;

  try {
    const bodyBuffer = await request.text(); // Raw request body
    event = stripe.webhooks.constructEvent(
      bodyBuffer,
      sig!,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    Logger.ERROR(`Webhook signature verification failed: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  Logger.INFO(`*** STRIPE WEBHOOK CALLED WITH EVENT ${event.type}`);

  const success = new Response(
    JSON.stringify({ processed_event: event.type }),
    {
      status: 200,
    },
  );


  if (event.type !== "charge.succeeded") {
    Logger.INFO(`Ignoring event ${event.type} - not charge.succeeded`);
    return success;
  }

  Logger.INFO(`*** Processing event ${event.type}`);

  const charge = event.data.object as Stripe.Charge;
  const paymentIntentId = charge.payment_intent as string;

  try {
    // Step 1: Retrieve purchase and user_id from the `Purchases` table
    // First, check if purchase is already confirmed
    const purchase = await getPurchase(paymentIntentId);

    if (purchase.payment_confirmed) {
      Logger.INFO("Payment already confirmed, skipping processing", {
        paymentIntentId,
      });
      return success;
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // TODO Update purchase_event with event = User ID retrieved from Purchases value = ${userId}
    const userId = purchase.user_id;
    Logger.INFO(`User ID retrieved from Purchases: ${userId}`);

    // Step 2. Update pre-purchase with payment method, timestamp and confirm the purchase
    await upsertPurchaseToConfirmPayment(paymentIntent);

    const basketItems = purchase.items as BasketItem[];
    const webinarBasketItems = basketItems.filter(
      (item) => item.product_type === "webinar",
    );
    const courseBasketItems = basketItems.filter(
      (item) => item.product_type === "course",
    );

    // Step 3 insert ticket into WebinarTickets if there are any
    if (webinarBasketItems.length > 0) {
      try {
        await insertWebinarTickets(purchase.id, webinarBasketItems, userId);
        Logger.INFO("Successfully created webinar tickets", {
          purchaseId: purchase.id,
          userId,
          itemCount: webinarBasketItems.length,
        });
      } catch (error) {
        Logger.ERROR("Failed to create webinar tickets", {
          error: error instanceof Error ? error.message : "Unknown error",
          userId,
          items: webinarBasketItems,
        });
        throw new Error(
          "Failed to create webinar tickets. Please try again later.",
        );
      }
    }

    // Step 4: Fetch the user details from the `Users` table
    const user = await getUser(userId);

    // Step 5 Send purchase confirmation email
    // And Step 6 sub to Kit
    await sendPurchaseConfirmationAndSubToKit(
      user,
      paymentIntentId,
      paymentIntent.amount,
      purchase.items as BasketItem[],
    );

    // Step 6
    // Add Zapier webhook call for courses
    await postCoursesToZapierWithRetry(userId, user, courseBasketItems);

    // Return 200 to indicate successful purchase
    return success;
  } catch (err) {
    Logger.ERROR(`Error handling event ${event.type}: ${err}`);
    return new Response("Internal Server Error", { status: 500 });
  }
}
