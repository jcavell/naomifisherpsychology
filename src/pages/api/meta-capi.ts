import type { APIRoute } from "astro";
import crypto from "crypto";
import { env } from "../../scripts/env.ts";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${env.META_PIXEL_ID}/events?access_token=${env.META_CAPI_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            {
              event_name: body.event_name, // e.g. "Purchase"
              event_time: Math.floor(Date.now() / 1000),
              event_id: body.event_id, // for deduplication with Pixel
              action_source: "website",
              event_source_url: body.event_source_url,
              user_data: {
                client_ip_address: body.client_ip,
                client_user_agent: body.user_agent,
                em: body.email ? [hash(body.email)] : undefined,
              },
              custom_data: body.custom_data,
            },
          ],
        }),
      },
    );

    const result = await response.json();
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};

function hash(data: string) {
  return crypto
    .createHash("sha256")
    .update(data.trim().toLowerCase())
    .digest("hex");
}
