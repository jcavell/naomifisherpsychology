import { stripe } from "./init-stripe.ts";
import calculateOrderAmount from "../../scripts/calculateOrderAmount.ts";
import type { LineItem } from "../../types/LineItem.d.ts";

export const prerender = false;

function createMetadataFromLineItems(
  items: LineItem[],
): Record<string, string> {
  const metadataArray = items.map((item, index) => {
    const itemIndex = index + 1; // Start numbering from 1

    return {
      [`item_${itemIndex}_name`]: item.product_data.name,
      [`item_${itemIndex}_id`]: item.product_data.id,
      [`item_${itemIndex}_price`]: item.unit_amount.toString(), // Convert price to string
    };
  });

  // Reduce the array of objects into a single metadata object
  return metadataArray.reduce((metadata, currentItem) => {
    return { ...metadata, ...currentItem };
  }, {});
}

export async function POST({ params, request }) {
  const json = await request.json();
  console.log("JSON: " + JSON.stringify(json));

  const { items } = json;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "gbp",
    metadata: createMetadataFromLineItems(items),
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return new Response(
    JSON.stringify({
      clientSecret: paymentIntent.client_secret,
    }),
  );
}
