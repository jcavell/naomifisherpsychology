import type { BasketItem } from "../../../types/basket-item";
import logger from "../../../scripts/logger.ts";
import getWebinars, { getWebinar } from "../../../scripts/webinars.ts";

// export const prerender = false;

const calculateExpiryIn30Days = (date: string) => {
  const expiryDate = new Date(date);
  expiryDate.setDate(expiryDate.getDate() + 30);
  return expiryDate.toISOString();
};


export async function getStaticPaths() {
  const webinars = await getWebinars(); // Get all webinars

  return webinars.flatMap(webinar =>
    webinar.tickets.map(ticket => ({
      params: {
        eventId_ticketId: `${webinar.id}_${ticket.id}`
      }
    }))
  );
}

export async function GET({ params, request }) {
  const eventIdTicketId = params.eventId_ticketId;
  const eventId = eventIdTicketId.split("_")[0];
  const ticketId = eventIdTicketId.split("_")[1];

  const isDev = import.meta.env.DEV;
  if (isDev) process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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

  const ticket = webinar.tickets.find((ticket) => ticket.id === ticketId);

  if (!ticket) {
    return new Response("EventbriteTicket not found", {
      headers: { "Content-Type": "application/json" },
      status: 404,
    });
  }

  const basketItem: BasketItem = {
    id: eventId + "_" + ticket.id,
    product_type: "webinar",
    is_course: false,
    is_webinar: true,
    product_id: eventId,
    product_name: webinar.title,
    product_description: webinar.description,
    product_images: [webinar.logoUrl],
    variant_id: ticket.id,
    variant_name: ticket.name,
    currency: "GBP",
    price: ticket.costValue || 0,
    formatted_price: ticket.costPlusFee,
    added_at: new Date().toISOString(),
    expires_at: ticket.salesEnd,
    quantity: 1, // Default quantity
    vatable: false, // default
  };

  return new Response(JSON.stringify(basketItem), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}
