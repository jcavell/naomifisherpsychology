import { paypal } from "../../scripts/checkout/init-paypal";
import paypalSdk from "@paypal/checkout-server-sdk";
import Logger from "../../scripts/logger";
import { validatePrices, generatePid, prepareItemsMetadata } from "./validate-and-prepare-payment";
import calculateOrderAmount from "../../scripts/checkout/calculateOrderAmount";

export const prerender = false;

export async function POST({ request }) {
  try {
    console.log("PayPal order creation started");

    const requestBody = await request.json();

    console.log("Request body:", requestBody);

    const { items } = requestBody;

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("Invalid items:", items);
      return new Response(
        JSON.stringify({ error: "Invalid or empty items array" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Get the origin from request
    const origin = new URL(request.url).origin;
    console.log("Origin:", origin);

    // Validate prices
    const isValid = await validatePrices(items, origin);
    if (!isValid) {
      console.error("Price validation failed for items:", items);
      return new Response(
        JSON.stringify({
          error: "Price mismatch detected. Please refresh your cart.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const pid = generatePid();
    const itemsMetadata = prepareItemsMetadata(items);
    const totalAmount = (calculateOrderAmount(items) / 100).toFixed(2);

    console.log("Order details:", {
      pid,
      totalAmount,
      itemsCount: items.length,
      itemsMetadata
    });

    // Check if PayPal is properly initialized
    if (!paypal) {
      console.error("PayPal not properly initialized:", paypal);
      return new Response(
        JSON.stringify({ error: "PayPal service not available" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    console.log("PayPal client initialized:", {
      hasClient: !!paypal,
      environment: paypal.environment?.constructor?.name,
      baseUrl: paypal.environment?.baseUrl
    });

    // Create PayPal order with proper error handling
    const orderRequest = {
      intent: "CAPTURE",
      purchase_units: [{
        amount: {
          currency_code: "GBP",
          value: totalAmount,
          breakdown: {
            item_total: {
              currency_code: "GBP",
              value: totalAmount
            }
          }
        },
        items: items.map(item => ({
          name: item.name || `Item ${item.id}`,
          unit_amount: {
            currency_code: "GBP",
            value: (item.discountedPriceInPence / 100).toFixed(2)
          },
          quantity: "1",
          category: "DIGITAL_GOODS"
        })),
        custom_id: pid,
        description: JSON.stringify(itemsMetadata)
      }],
      application_context: {
        return_url: `${origin}/checkout-complete`,
        cancel_url: `${origin}/checkout`,
        brand_name: "Naomi Fisher Psychology",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING"
      }
    };

    console.log("Creating PayPal order with request:", JSON.stringify(orderRequest, null, 2));

    // Use PayPal SDK properly
    const payPalReq = new paypalSdk.orders.OrdersCreateRequest();
    payPalReq.prefer("return=representation");
    payPalReq.requestBody(orderRequest);

    const paypalOrder = await paypal.execute(payPalReq);

    console.log("PayPal order created successfully:", { orderId: paypalOrder.result.id });

    Logger.INFO("Created PayPal order:", { orderId: paypalOrder.result.id, pid });

    return new Response(
      JSON.stringify({ orderId: paypalOrder.result.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Detailed error in create-paypal-order:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      details: error.details || error.response?.data
    });

    Logger.ERROR("Error in create-paypal-order:", error);

    // Return more specific error information in development
    const isDev = process.env.NODE_ENV === 'development';
    const errorMessage = isDev
      ? `PayPal Error: ${error.message}`
      : "An error occurred while processing your request";

    return new Response(
      JSON.stringify({
        error: errorMessage,
        ...(isDev && { details: error.details || error.stack })
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}