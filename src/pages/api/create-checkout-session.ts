import Stripe from "stripe";

export const prerender = false;

const stripe: Stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

export async function POST({ params, request }) {
  const { origin } = new URL(request.url);

  const json = await request.json();
  const { line_items } = json;

  console.log("JSON: " + JSON.stringify(json));

  // Validate line_items
  if (
    !line_items ||
    !Array.isArray(line_items) ||
    line_items.length === 0 ||
    !line_items.every((item) => item.price && item.quantity)
  ) {
    return new Response(
      JSON.stringify({
        error: "Invalid line_items data",
        line_items: line_items,
      }),
      { status: 400 }, // Bad Request
    );
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items,
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
