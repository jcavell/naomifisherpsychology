import Logger from "../logger.ts";
import Stripe from "stripe";
import { createSbClient } from "./create-sb-client.ts";

export const prerender = false;

const supabase = createSbClient;

export const getPurchase = async (paymentIntentId: string) => {
  const { data: purchase, error: purchaseError } = await supabase
    .from("Purchases")
    .select(
      "id, user_id, payment_authorised_timestamp, payment_amount_pence, items",
    )
    .eq("stripe_payment_id", paymentIntentId)
    .single();

  if (purchaseError || !purchase) {
    // TODO Update purchase_event with error = event = Failed to retrieve Purchases record or user_id value = ${purchaseError}`
    Logger.ERROR(
      `Failed to retrieve Purchases record or user_id: ${purchaseError}`,
    );
    throw new Error("Failed to retrieve user_id from Purchases record.");
  }

  return purchase;
};

export const upsertPurchaseToConfirmPayment = async (
  paymentIntent: Stripe.Response<Stripe.PaymentIntent>,
) => {
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
    // TODO Update purchase_event with error = event = 'Failed to upsert purchase record' value = ${updateError}`
    throw new Error(`Failed to upsert purchase record: ${updateError.message}`);
  }

  console.log("Purchase record successfully updated.");
  // TODO Update purchase_event with event Purchase updated to confirm purchase value = ''
};
