import type { Webinar } from "../../../types/webinar";
import type { BasketItem } from "../../../types/basket-item";

export const prerender = false;

const calculateExpiryIn30Days = (date: string) => {
  const expiryDate = new Date(date);
  expiryDate.setDate(expiryDate.getDate() + 30);
  return expiryDate.toISOString();
};

export async function GET({ params, request }) {
  const eventIdTicketId = params.eventId_ticketId;
  const eventId = eventIdTicketId.split("_")[0];
  const ticketId = eventIdTicketId.split("_")[1];
  const baseUrl = new URL(request.url).origin;

  const isDev = import.meta.env.DEV;

  if (isDev) process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  const response = await fetch(`${baseUrl}/api/webinars/${eventId}`);
  const webinar: Webinar = await response.json();

  const ticketClass = webinar.ticket_classes.find(
    (ticket) => ticket.id === ticketId,
  );

  if (!ticketClass) {
    return new Response("Ticket not found", {
      headers: { "Content-Type": "application/json" },
      status: 404,
    });
  }

  const checkoutItem: BasketItem = {
    id: eventId + "_" + ticketClass.id,
    product_type: "webinar",
    is_course: false,
    is_webinar: true,
    product_id: eventId,
    product_name: webinar.name.text,
    product_description: webinar.description.text,
    product_images: [webinar.logo.original.url],
    variant_id: ticketClass.id,
    variant_name: ticketClass.name,
    currency: ticketClass.cost?.currency || "GBP",
    price: ticketClass.cost?.value || 0,
    formatted_price: ticketClass.cost?.display || "£0.00",
    added_at: new Date().toISOString(),
    expires_at: ticketClass.sales_end,
    quantity: 1, // Default quantity
    vatable: false, // default
  };

  console.log(
    "api/webinar-tickets checkout items" + JSON.stringify(checkoutItem),
  );

  return new Response(JSON.stringify(checkoutItem), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}
