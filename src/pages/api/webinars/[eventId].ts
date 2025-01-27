import type { APIRoute } from "astro";
import type { Webinar } from "../../../types/webinar";

const EB_BEARER = import.meta.env.EB_BEARER as string;

const getLiveWebinars = async (): Promise<Webinar[]> => {
  const eventsResponse = await fetch(
    "https://www.eventbriteapi.com/v3/organizations/495447088469/events/?status=live",
    {
      headers: {
        Authorization: `Bearer ${EB_BEARER}`,
      },
    },
  );
  const webinars: { events: Webinar[] } = await eventsResponse.json();
  return webinars.events;
};

export const GET: APIRoute = async ({ params, request }): Promise<Response> => {
  const eventId = params.eventId;

  const eventResponse = await fetch(
    `https://www.eventbriteapi.com/v3/events/${eventId}/?expand=ticket_availability,ticket_classes`,
    {
      headers: {
        Authorization: `Bearer ${EB_BEARER}`,
      },
    },
  );
  const webinar: Webinar = await eventResponse.json();

  return new Response(JSON.stringify(webinar), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
};

export async function getStaticPaths(): Promise<
  { params: { eventId: string } }[]
> {
  const webinars = await getLiveWebinars();

  return webinars.map((webinar: Webinar) => {
    return { params: { eventId: webinar.id } };
  });
}
