import type { APIRoute } from "astro";
import { createSbClient } from "../../scripts/checkout/create-sb-client.ts";
import type { BasketItem } from "../../types/basket-item.ts";

export const prerender = false;

const supabase = createSbClient;

export interface PurchaseData {
  id: bigint;
  session_id: string;
  stripe_payment_id: string;
  payment_confirmed: boolean;
  items: BasketItem[];
  created_at: string;
  user_id: string;
  coupon_code?: string;
  t?: string;
  Users: {
    id: bigint;
    first_name: string;
    surname: string;
    email: string;
  };
}

export const GET: APIRoute = async ({ request, url, cookies }) => {

  const sessionId = cookies.get("checkout_session_id")?.value;

  if (!sessionId) {
    return new Response(
      JSON.stringify({ error: "Missing checkout session" }),
      {
        status: 400,
      },
    );
  }

  let query = supabase
    .from("Purchases") // Changed to match your insert table name
    .select(
      `
      id,
      session_id,
      stripe_payment_id, 
      payment_confirmed,
      items,
      created_at,
      user_id,
      coupon_code,
      t,
      Users (
        id,
        first_name,
        surname,
        email
      )
    `,
    );

  query = query.eq("session_id", sessionId);

  const { data, error } = await query.single();

  if (error || !data) {
    console.log(error);
    return new Response(
      JSON.stringify({ error: error?.message ?? "Not found" }),
      {
        status: 404,
      },
    );
  }

  return new Response(JSON.stringify(data), { status: 200 });
};