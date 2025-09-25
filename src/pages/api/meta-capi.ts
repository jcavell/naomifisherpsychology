import type { APIRoute } from "astro";
import crypto from "crypto";
import { env } from "../../scripts/env.ts";
import type {
  PixelEvent,
  PixelEventName,
} from "../../scripts/tracking/metaPixel.ts";
import type { User } from "../../types/user";

export const prerender = false;

export type MetaCAPIRequestBody = {
  event_name: PixelEventName;
  event_id: string;
  event_source_url: string;
  client_user_agent: string;
  userDetails?: User;
  pixelEvent: PixelEvent;
};

function getClientIp(request: Request): string {
  const netlifyIp = request.headers.get("x-nf-client-connection-ip");
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  return (
    netlifyIp || forwardedFor?.split(",")[0]?.trim() || realIp || "0.0.0.0"
  );
}

function getFacebookBrowserId(request: Request) {
  const cookies = request.headers.get("cookie") || "";
  const cookieMap = new Map(
    cookies.split(";").map((cookie) => {
      const [key, value] = cookie.trim().split("=");
      return [key, value];
    }),
  );

  return cookieMap.get("_fbp");
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as MetaCAPIRequestBody;
    const clientIp = getClientIp(request);
    const fbp = getFacebookBrowserId(request);

    const jsonBody = JSON.stringify({
      data: [
        {
          event_name: body.event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id: body.event_id,
          action_source: "website",
          event_source_url: body.event_source_url,
          user_data: {
            client_ip_address: clientIp,
            client_user_agent: body.client_user_agent,
            // Add hashed user data if available
            em: body.userDetails?.email ? [hash(body.userDetails.email)] : [],
            fn: body.userDetails?.first_name
              ? [hash(body.userDetails.first_name)]
              : [],
            ln: body.userDetails?.surname
              ? [hash(body.userDetails.surname)]
              : [],
            ...(fbp && { fbp }),
          },
          custom_data: {
            content_ids: body.pixelEvent.content_ids,
            content_type: "product",
            content_category: body.pixelEvent.content_category,
            currency: body.pixelEvent.currency,
            value: body.pixelEvent.value,
            num_items: body.pixelEvent.num_items,
            contents: body.pixelEvent.contents,
            ...(body.pixelEvent.order_id && {
              order_id: body.pixelEvent.order_id,
            }),
          },
        },
      ],
    });

    // console.log("Sending to Meta CAPI with body: ", jsonBody);

    const response = await fetch(
      `https://graph.facebook.com/v21.0/${env.META_PIXEL_ID}/events?access_token=${env.META_CAPI_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonBody,
      },
    );

    if (!response.ok) {
      console.error("Meta CAPI Error:", await response.text());
      return new Response(
        JSON.stringify({ error: "Meta CAPI request failed" }),
        {
          status: response.status,
        },
      );
    }

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
