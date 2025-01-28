import { s as stripe } from '../../chunks/init-stripe_B4VK9JjZ.mjs';
export { renderers } from '../../renderers.mjs';

function calculateOrderAmount(items) {
  return items.reduce((total, item) => {
    return total + item.price;
  }, 0);
}

const prerender = false;
function createMetadataFromCheckoutItems(items) {
  const metadataArray = items.map((item, index) => {
    const itemIndex = index + 1;
    return {
      [`item_${itemIndex}_name`]: item.product_name,
      [`item_${itemIndex}_id`]: item.product_id,
      [`item_${itemIndex}_price`]: item.price.toString()
      // Convert price to string
    };
  });
  return metadataArray.reduce((metadata, currentItem) => {
    return { ...metadata, ...currentItem };
  }, {});
}
async function POST({ params, request }) {
  const rawBody = await request.text();
  console.log("Full raw request body: ", rawBody);
  const json = JSON.parse(rawBody);
  const { items } = json;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "gbp",
    metadata: createMetadataFromCheckoutItems(items),
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true
    }
  });
  return new Response(
    JSON.stringify({
      clientSecret: paymentIntent.client_secret
    })
  );
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
