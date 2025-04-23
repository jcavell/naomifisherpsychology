import type { APIRoute } from "astro";
import { getWebinar } from "../../../scripts/webinars.ts";
export const prerender = false;

export const GET: APIRoute = async ({ params, request }): Promise<Response> => {
  const eventId = params.eventId;

  if (!eventId) {
    return new Response(JSON.stringify({ error: "Event ID is required" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }

  const webinar = await getWebinar(eventId);

  if (!webinar) {
    return new Response(JSON.stringify({ error: "Webinar not found" }), {
      headers: { "Content-Type": "application/json" },
      status: 404,
    });
  }

  return new Response(JSON.stringify(webinar), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
};
