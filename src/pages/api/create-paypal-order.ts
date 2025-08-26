import { paypal } from "../../scripts/checkout/init-paypal";
import Logger from "../../scripts/logger";
import { validatePrices, generatePid, prepareItemsMetadata } from "./validate-and-prepare-payment";
import calculateOrderAmount from "../../scripts/checkout/calculateOrderAmount";

export const prerender = false;

export async function POST({ request }) {
  try {
    const { items } = await request.json();

    const isValid = await validatePrices(items, new URL(request.url).origin);
    if (!isValid) {
      return new Response(
        JSON.stringify({
          error: "Price mismatch detected. Please refresh your cart.",
        }),
        { status: 400 }
      );
    }

    const pid = generatePid();
    const itemsMetadata = prepareItemsMetadata(items);
    const amount = calculateOrderAmount(items);

    const paypalOrder = await paypal.orders.create({
      intent: "CAPTURE",
      purchase_units: [{
        amount: {
          currency_code: "GBP",
          value: (amount / 100).toFixed(2),
        },
        custom_id: pid,
        description: JSON.stringify(itemsMetadata)
      }]
    });

    Logger.INFO("Created PayPal order:", { orderId: paypalOrder.id });

    return new Response(JSON.stringify({ orderId: paypalOrder.id }));
  } catch (error) {
    Logger.ERROR("Error in create-paypal-order:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while processing your request" }),
      { status: 500 }
    );
  }
}