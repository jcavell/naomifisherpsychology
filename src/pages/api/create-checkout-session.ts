import Stripe from "stripe";
const stripe: Stripe = new Stripe(
  "sk_test_51QYVqyReZarnNjSdyod4dc2MX3YyUMEdJli7HrjPC42x3tGU1XG3uJYKgYD3bUtnR3pBZoPtDXcpddDmCWstq7fB00UxqAL7hS",
);
const site = import.meta.env.SITE || "http://localhost:4321";

export async function POST({ params, request }) {
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: "price_1Qc47iReZarnNjSd5z0YEPBJ",
        quantity: 1,
      },
    ],
    mode: "payment",
    return_url: `${site}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  return new Response(
    JSON.stringify({
      clientSecret: session.client_secret,
    }),
  );
}
