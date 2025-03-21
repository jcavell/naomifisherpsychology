import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "./init-stripe.ts";
import Logger from "../../scripts/logger.ts";
import type { Purchase } from "../../types/postmark-purchase";
import { sendPurchaseConfirmationEmail } from "../../scripts/send-purchase-confirmation-via-postmark.ts";
import type { BasketItem } from "../../types/basket-item";
import moment from "moment";

export const prerender = false; // Disable static pre-rendering for this endpoint

const formattedPrice = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const supabase = createClient(
  import.meta.env.SUPABASE_API_URL,
  import.meta.env.SUPABASE_API_KEY,
);

async function createWebinarTickets(
  purchaseId: number,
  basketItems: BasketItem[],
  userId: number,
): Promise<void> {
  // Filter only webinar items
  const webinarItems = basketItems.filter((item) => item.is_webinar);

  // Get webinars one by one (since we need to handle each ticket separately anyway)
  const tickets = await Promise.all(
    webinarItems.map(async (item) => {
      const webinarId = parseInt(item.product_id);
      const ticketId = parseInt(item.variant_id);

      const { data: webinar, error: webinarError } = await supabase
        .from("Webinars")
        .select("recorded_ticket_id")
        .eq("webinar_id", webinarId)
        .single();

      if (webinarError) {
        Logger.ERROR("Failed to fetch webinar details", {
          error: webinarError,
          webinarId,
        });
        throw new Error(
          `Failed to fetch webinar details: ${webinarError.message}`,
        );
      }

      return {
        webinar_id: webinarId,
        purchase_id: purchaseId,
        ticket_id: ticketId,
        ticket_name: item.variant_name,
        user_id: userId,
        is_recording_ticket: webinar.recorded_ticket_id === ticketId,
        email_sent_sent_starting_in_2_hours: false,
        email_sent_sent_starting_in_20_mins: false,
        email_sent_recording: false,
      };
    }),
  );

  // Insert tickets into Supabase
  if (tickets.length > 0) {
    const { error } = await supabase.from("WebinarTickets").insert(tickets);

    if (error) {
      Logger.ERROR("Failed to create webinar tickets", { error });
      throw new Error(`Failed to create webinar tickets: ${error.message}`);
    }
  }
}

export async function POST({ request }: { request: Request }) {
  const sig = request.headers.get("stripe-signature");
  let event: Stripe.Event;

  try {
    const bodyBuffer = await request.text(); // Raw request body
    event = stripe.webhooks.constructEvent(
      bodyBuffer,
      sig!,
      import.meta.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    Logger.ERROR(`Webhook signature verification failed: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const success = new Response(
    JSON.stringify({ processed_event: event.type }),
    {
      status: 200,
    },
  );

  if (event.type !== "charge.succeeded") {
    Logger.INFO(`*** IGNORING EVENT ${event.type}`);
    return success;
  }

  Logger.INFO(`*** Processing event ${event.type}`);

  const charge = event.data.object as Stripe.Charge;
  const paymentIntentId = charge.payment_intent as string;

  try {
    // Fetch the full PaymentIntent object using the Stripe API
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    // Logger.INFO(`Retrieved PaymentIntent: ${JSON.stringify(paymentIntent)}`);

    Logger.INFO(
      "Attempting to retrieve user_id from Purchases table for stripe_charge_id of " +
        charge.id,
    );

    // Step 1: Retrieve `user_id` from the `Purchases` table
    const { data: purchase, error: purchaseError } = await supabase
      .from("Purchases")
      .select(
        "id, user_id, payment_authorised_timestamp, payment_amount_pence, items",
      )
      .eq("stripe_payment_id", paymentIntentId)
      .single();

    if (purchaseError || !purchase) {
      Logger.ERROR(
        `Failed to retrieve Purchases record or user_id: ${purchaseError}`,
      );
      throw new Error("Failed to retrieve user_id from Purchases record.");
    }
    const userId = purchase.user_id;
    Logger.INFO(`User ID retrieved from Purchases: ${userId}`);

    // Step 2. Update pre-purchase with payment method, timestamp and confirm the purchase
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

    // Step 3 insert ticket into WebinarTickets
    try {
      await createWebinarTickets(
        purchase.id,
        purchase.items as BasketItem[],
        userId,
      );
      Logger.INFO("Successfully created webinar tickets", {
        purchaseId: purchase.id,
        userId,
        itemCount: purchase.items.length,
      });
    } catch (error) {
      Logger.ERROR("Failed to create webinar tickets", {
        error: error instanceof Error ? error.message : "Unknown error",
        userId,
        items: purchase.items,
      });
      throw new Error(
        "Failed to create webinar tickets. Please try again later.",
      );
    }

    // Step 4: Fetch the user details from the `Users` table
    const { data: user, error: userError } = await supabase
      .from("Users")
      .select("first_name, surname, email, subscribed_to_marketing")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      Logger.ERROR("Failed to retrieve user details from Supabase:", userError);
      throw new Error("Failed to retrieve user details by user_id.");
    }

    Logger.INFO("User details retrieved", user);

    // Step 5 Send purchase confirmation email
    const postmarkPurchase: Purchase = {
      first_name: user.first_name,
      surname: user.surname,
      email: user.email,
      stripe_payment_id: paymentIntent.id,
      purchase_date: moment().format("Do MMMM YYYY"),
      total: formattedPrice.format(paymentIntent.amount),
      items: purchase.items as BasketItem[],
    };

    // TODO - maybe await and then update the users table with email confirmation sent
    sendPurchaseConfirmationEmail(postmarkPurchase);

    // Step 6 POST user to Kit only if the user clicked subscribe to marketing
    if (user.subscribed_to_marketing) {
      // Step 2.C. Double check they are not in Kit already
      const KIT_API_KEY = import.meta.env.KIT_API_KEY;
      const KIT_BASE_URL = "https://api.convertkit.com/v4";

      // Step 5 Upsert subscriber in Kit
      const inputBody = {
        email_address: user.email,
        first_name: user.first_name, // First name from Supabase
        state: "inactive", // Set initial state to inactive to require double opt-in
        fields: {
          "Last name": user.surname, // Surname from Supabase
          Source: "Website purchase",
        },
      };

      Logger.INFO("Input body for new Kit subscriber:", inputBody);

      const createResponse = await fetch(`${KIT_BASE_URL}/subscribers`, {
        method: "POST",
        headers: {
          "X-Kit-Api-Key": KIT_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputBody),
      });

      if (!createResponse.ok) {
        throw new Error(
          `Failed to create Kit subscriber: ${createResponse.statusText}`,
        );
      }

      const createData = await createResponse.json();
      Logger.INFO(`New subscriber created: ${JSON.stringify(createData)}`);
      const subscriberId = createData.subscriber.id;

      if (subscriberId) {
        // Step 6 Add the new subscriber to a form
        const formId = 7696333;

        const addToFormResponse = await fetch(
          `${KIT_BASE_URL}/forms/${formId}/subscribers/${subscriberId}`,
          {
            method: "POST",
            headers: {
              "X-Kit-Api-Key": KIT_API_KEY,
              "Content-Type": "application/json",
            },
          },
        );

        if (!addToFormResponse.ok) {
          throw new Error(
            `Failed to add subscriber to form: ${addToFormResponse.statusText}`,
          );
        }

        Logger.INFO(`Subscriber successfully added to form ${formId}.`);
      }
    }

    // Return 200 to indicate successful purchase
    return success;
  } catch (err) {
    Logger.ERROR(`Error handling event ${event.type}: ${err}`);
    return new Response("Internal Server Error", { status: 500 });
  }
}
