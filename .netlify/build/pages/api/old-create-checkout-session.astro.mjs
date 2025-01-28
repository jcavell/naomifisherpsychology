import { s as stripe } from '../../chunks/init-stripe_B4VK9JjZ.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
async function POST({ params, request }) {
  const { origin } = new URL(request.url);
  const json = await request.json();
  const { line_items } = json;
  console.log("JSON: " + JSON.stringify(json));
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items,
    // discounts: [{ coupon: "qkhhR4P7" }],
    mode: "payment",
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`
  });
  return new Response(
    JSON.stringify({
      clientSecret: session.client_secret
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
