import { stripe } from "./init-stripe.ts";
import calculateOrderAmount from "../../scripts/calculateOrderAmount.ts";
import type { BasketAndCheckoutItem } from "../../types/basket-and-checkout-item";

export const prerender = false;

// function createMetadataFromCheckoutItems(
//   items: BasketAndCheckoutItem[],
// ): Record<string, string> {
//   const metadataArray = items.map((item, index) => {
//     const itemIndex = index + 1; // Start numbering from 1
//
//     return {
//       [`item_${itemIndex}_name`]: item.product_name,
//       [`item_${itemIndex}_id`]: item.product_id,
//       [`item_${itemIndex}_price`]: item.unit_price.toString(), // Convert price to string
//     };
//   });
//
//   // Reduce the array of objects into a single metadata object
//   return metadataArray.reduce((metadata, currentItem) => {
//     return { ...metadata, ...currentItem };
//   }, {});
// }

export async function POST({ params, request }) {
  const rawBody = await request.text();
  console.log("Full raw request body: ", rawBody);

  const json = JSON.parse(rawBody); // Safely parse the raw body as JSON
  // console.log("Parsed request body (as JSON): ", json);

  const { items } = json as { items: BasketAndCheckoutItem[] };
  const itemsForMetaData = items.map(
    ({
      product_id,
      variant_name,
      added_at,
      variant_description,
      product_description,
      product_images,
      expires_at,
      ...rest
    }) => rest,
  );

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "gbp",
    metadata: { items: JSON.stringify(itemsForMetaData) },
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
