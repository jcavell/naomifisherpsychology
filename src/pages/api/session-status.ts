import Stripe from "stripe";

export const prerender = false;

const stripe: Stripe = new Stripe(
  "sk_test_51QYVqyReZarnNjSdyod4dc2MX3YyUMEdJli7HrjPC42x3tGU1XG3uJYKgYD3bUtnR3pBZoPtDXcpddDmCWstq7fB00UxqAL7hS",
);
const site = import.meta.env.SITE || "http://localhost:4321";

export async function GET({ params, request }) {
  const session = await stripe.checkout.sessions.retrieve(
    request.query.session_id,
  );

  return new Response(
    JSON.stringify({
      status: session.status,
      customer_email: session.customer_details?.email,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
