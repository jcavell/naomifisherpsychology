import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "./init-stripe.ts";
import Logger from "../../scripts/logger.ts";
import type { Purchase } from "../../types/postmark-purchase";
import { sendPurchaseConfirmationEmail } from "../../scripts/send-purchase-confirmation-via-postmark.ts";
import type { BasketItem } from "../../types/basket-item";
import moment from "moment";

export const prerender = false; // Disable static pre-rendering for this endpoint

const KIT_API_KEY = import.meta.env.KIT_API_KEY;
const KIT_BASE_URL = "https://api.convertkit.com/v4";

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
  try {
    // Filter only webinar items
    const webinarItems = basketItems.filter((item) => item.is_webinar);

    Logger.INFO("Creating webinar tickets", {
      purchaseId,
      userId,
      webinarItemsCount: webinarItems.length,
      webinarItems, // Log the actual items for debugging
    });

    // Get webinars one by one (since we need to handle each ticket separately anyway)
    const tickets = await Promise.all(
      webinarItems.map(async (item) => {
        const webinarId = parseInt(item.product_id);
        const ticketId = parseInt(item.variant_id);

        Logger.INFO("Fetching webinar details", { webinarId, ticketId });
        const { data: webinar, error: webinarError } = await supabase
          .from("Webinars")
          .select("webinar_name, recorded_ticket_id")
          .eq("webinar_id", webinarId)
          .single();

        if (webinarError) {
          Logger.ERROR("Failed to fetch webinar details", {
            error: webinarError,
            webinarId,
            ticketId,
          });
          throw new Error(
            `Failed to fetch webinar details: ${webinarError.message}`,
          );
        }

        const ticket = {
          webinar_id: webinarId,
          purchase_id: purchaseId,
          ticket_id: ticketId,
          ticket_name: webinar.webinar_name + " " + item.variant_name,
          user_id: userId,
          is_recording_ticket: webinar.recorded_ticket_id === ticketId,
          emailed_starting_in_10_mins: false,
          emailed_zoom_details: false,
          emailed_starting_in_2_hours: false,
          emailed_recording: false,
        };

        Logger.INFO("Created ticket object", { ticket });
        return ticket;
      }),
    );

    // Insert tickets into Supabase
    if (tickets.length > 0) {
      Logger.INFO("Attempting to insert tickets", {
        ticketCount: tickets.length,
        tickets,
      });
      const { error } = await supabase.from("WebinarTickets").insert(tickets);

      if (error) {
        throw new Error(`Failed to create webinar tickets: ${error.message}`);
      }
    }
  } catch (error) {
    Logger.ERROR("Error in createWebinarTickets", {
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
            }
          : "Unknown error",
      purchaseId,
      userId,
      basketItems,
    });
    throw error;
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

  // TODO Update purchase_event with event = webhook_received value = ${event.type}
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
      // TODO Update purchase_event with error = event = Failed to retrieve Purchases record or user_id value = ${purchaseError}`
      Logger.ERROR(
        `Failed to retrieve Purchases record or user_id: ${purchaseError}`,
      );
      throw new Error("Failed to retrieve user_id from Purchases record.");
    }
    const userId = purchase.user_id;
    // TODO Update purchase_event with event = User ID retrieved from Purchases value = ${userId}
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
      // TODO Update purchase_event with error = event = 'Failed to upsert purchase record' value = ${updateError}`
      throw new Error(
        `Failed to upsert purchase record: ${updateError.message}`,
      );
    }

    console.log("Purchase record successfully updated.");
    // TODO Update purchase_event with event Purchase updated to confirm purchase value = ''

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
      .select(
        "first_name, surname, email, subscribed_to_marketing, kit_subscriber_id",
      )
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
      total: formattedPrice.format(paymentIntent.amount / 100), // amount is in pence
      items: purchase.items as BasketItem[],
    };

    // TODO - await update purchase_event table with email_sent event
    sendPurchaseConfirmationEmail(postmarkPurchase);

    Logger.INFO(
      "User ticked subscribe to marketing? " + user.subscribed_to_marketing,
    );
    Logger.INFO(
      "User already has a kit subscriber id? " + user.kit_subscriber_id
        ? "YES: " + user.kit_subscriber_id
        : "NO",
    );

    // Step 6 Create new Kit subscriber (POST user to Kit /subscribers) only if:
    // (1) The user clicked subscribe to marketing checkbox AND
    // (2) They don't already have a kit_subscriber_id
    if (user.subscribed_to_marketing && !user.kit_subscriber_id) {
      const inputBody = {
        email_address: user.email,
        first_name: user.first_name, // First name from Supabase
        state: "inactive", // Set initial state to inactive to require double opt-in
        fields: {
          "Last name": user.surname, // Surname from Supabase
          Source: "Website purchase",
        },
      };

      Logger.INFO(
        "Adding subscriber to kit with input body for new Kit subscriber:",
        inputBody,
      );

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
        // Add the new Kit subscriber to a form
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
    } else {
      Logger.INFO(
        "Skipping Kit subscriber creation as user already has a kit subscriber id.",
      );
    }

    // Return 200 to indicate successful purchase
    return success;
  } catch (err) {
    Logger.ERROR(`Error handling event ${event.type}: ${err}`);
    return new Response("Internal Server Error", { status: 500 });
  }
}
