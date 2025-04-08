import type { Purchase } from "../../types/postmark-purchase";
import moment from "moment/moment";
import type { BasketItem } from "../../types/basket-item";
import { sendPurchaseConfirmationEmail } from "./send-purchase-confirmation-via-postmark.ts";
import Logger from "../logger.ts";
import type { User } from "../../types/user";
import { env } from "../env";

export const prerender = false;

const KIT_API_KEY = env.KIT_API_KEY;
const KIT_BASE_URL = "https://api.convertkit.com/v4";

const formattedPrice = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export const sendPurchaseConfirmationAndSubToKit = async (
  user: User,
  paymentIntentId: string,
  amountInPence: number,
  items: BasketItem[],
) => {
  const postmarkPurchase: Purchase = {
    first_name: user.first_name,
    surname: user.surname,
    email: user.email,
    stripe_payment_id: paymentIntentId,
    purchase_date: moment().format("Do MMMM YYYY"),
    total: formattedPrice.format(amountInPence / 100), // amount is in pence
    items: items,
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

  // Create new Kit subscriber (POST user to Kit /subscribers) only if:
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
};
