import Stripe from "stripe";

export const prerender = false;

const stripe: Stripe = new Stripe(
  "sk_test_51QYVqyReZarnNjSdyod4dc2MX3YyUMEdJli7HrjPC42x3tGU1XG3uJYKgYD3bUtnR3pBZoPtDXcpddDmCWstq7fB00UxqAL7hS",
);

export async function GET({ params, request }) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId) {
    return new Response(JSON.stringify({ error: "No session_id provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

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
