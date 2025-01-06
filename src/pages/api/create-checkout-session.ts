import Stripe from "stripe";

export const prerender = false;

const stripe: Stripe = new Stripe(
  "sk_test_51QYVqyReZarnNjSdyod4dc2MX3YyUMEdJli7HrjPC42x3tGU1XG3uJYKgYD3bUtnR3pBZoPtDXcpddDmCWstq7fB00UxqAL7hS",
);

export async function POST({ params, request }) {
  const { origin } = new URL(request.url);
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        price: "price_1Qc47iReZarnNjSd5z0YEPBJ",
        quantity: 1,
      },
      {
        price: "price_1QeG0iReZarnNjSd7QT3M2zJ",
        quantity: 1,
      },
    ],
    discounts: [{ coupon: "qkhhR4P7" }],
    mode: "payment",
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  return new Response(
    JSON.stringify({
      clientSecret: session.client_secret,
    }),
  );
}
