import type { Purchase } from "../../types/postmark-purchase";
import Logger from "../logger.ts";
import { env } from "../env.ts";

export const prerender = false;

const POSTMARK_API_URL = "https://api.postmarkapp.com/email/withTemplate";
const TEMPLATE_ALIAS = "order-confirmation";
const EMAIL_HEADING = "Order Confirmation";
const EMAIL_FROM = "support@naomifisher.co.uk";

/**
 * Sends a purchase confirmation email via Postmark.
 * @param purchase The purchase details object.
 */
export async function sendPurchaseConfirmationEmail(
  purchase: Purchase,
): Promise<void> {
  const postmarkPayload = {
    From: EMAIL_FROM,
    To: purchase.email,
    TemplateAlias: TEMPLATE_ALIAS,
    TemplateModel: {
      email_heading: EMAIL_HEADING,
      first_name: purchase.first_name,
      surname: purchase.surname,
      email: purchase.email,
      total: purchase.total,
      stripe_payment_id: purchase.stripe_payment_id,
      purchase_date: purchase.purchase_date,
      contains_webinar: purchase.items.some((item) => item.is_webinar),
      contains_course: purchase.items.some((item) => item.is_course),
      items: purchase.items.map((item) => ({
        id: item.id,
        formatted_price: item.formatted_price,
        quantity: item.quantity,
        is_course: item.is_course,
        is_webinar: item.is_webinar,
        product_id: item.product_id,
        product_name: item.product_name,
        product_images: item.product_images,
        product_description: item.product_description,
        variant_id: item.variant_id,
        variant_name: item.variant_name,
        variant_description: item.variant_description,
      })),
    },
  };

  const response = await fetch(POSTMARK_API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": env.POSTMARK_SERVER_TOKEN,
    },
    body: JSON.stringify(postmarkPayload),
  });

  const responseText = await response.text();
  Logger.INFO("Postmark response:", { text: responseText });

  if (!response.ok) {
    throw new Error(`Failed to send email: ${response.statusText}`);
  }

  // Parse and check for Postmark API errors
  try {
    const responseData = JSON.parse(responseText);
    if (responseData.ErrorCode && responseData.ErrorCode !== 0) {
      Logger.ERROR("Postmark API error", {
        error: responseData.Message,
        errorCode: responseData.ErrorCode,
        email: purchase.email,
        paymentId: purchase.stripe_payment_id,
      });
      throw new Error(`Postmark API error: ${responseData.Message}`);
    }
  } catch (error) {
    Logger.ERROR("Failed to parse Postmark response", {
      error: error.message,
      responseText,
    });
    throw error;
  }

  Logger.INFO("Confirmation email successfully sent via Postmark.");
}
