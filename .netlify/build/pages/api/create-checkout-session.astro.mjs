import Stripe from 'stripe';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const stripe = new Stripe(
  "sk_test_51QYVqyReZarnNjSdyod4dc2MX3YyUMEdJli7HrjPC42x3tGU1XG3uJYKgYD3bUtnR3pBZoPtDXcpddDmCWstq7fB00UxqAL7hS"
);
const site = "https://www.naomifisher.co.uk";
async function POST({ params, request }) {
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: "price_1Qc47iReZarnNjSd5z0YEPBJ",
        quantity: 1
      }
    ],
    mode: "payment",
    return_url: `${site}/return?session_id={CHECKOUT_SESSION_ID}`
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
