import type { BasketItem } from "../../types/basket-item";
import Logger from "../logger.ts";
import { createClient } from "@supabase/supabase-js";
import { createSbClient } from "./create-sb-client.ts";

export const prerender = false;

const supabase = createSbClient;

export async function insertWebinarTickets(
  purchaseId: number | null,
  basketItems: BasketItem[],
  userId: number,
): Promise<void> {
  try {
    // Filter only webinar items
    const webinarItems = basketItems.filter((item) => item.is_webinar);

    Logger.INFO("Creating webinar tickets", {
      purchaseId,
      userId,
      webinarItemsCount: webinarItems.length,
      webinarItems, // Log the actual items for debugging
    });

    // Get webinars one by one (since we need to handle each ticket separately anyway)
    const tickets = await Promise.all(
      webinarItems.map(async (item) => {
        const webinarId = parseInt(item.product_id);
        const ticketId = parseInt(item.variant_id);

        Logger.INFO("Fetching webinar details", { webinarId, ticketId });
        const { data: webinar, error: webinarError } = await supabase
          .from("Webinars")
          .select("webinar_name, recorded_ticket_id")
          .eq("webinar_id", webinarId)
          .single();

        if (webinarError) {
          Logger.ERROR("Failed to fetch webinar details", {
            error: webinarError,
            webinarId,
            ticketId,
          });
          throw new Error(
            `Failed to fetch webinar details: ${webinarError.message}`,
          );
        }

        const ticket = {
          webinar_id: webinarId,
          purchase_id: purchaseId,
          ticket_id: ticketId,
          ticket_name: webinar.webinar_name + " " + item.variant_name,
          user_id: userId,
          is_recording_ticket: webinar.recorded_ticket_id === ticketId,
        };

        Logger.INFO("Created ticket object", { ticket });
        return ticket;
      }),
    );

    // Insert tickets into Supabase
    if (tickets.length > 0) {
      Logger.INFO("Attempting to insert tickets", {
        ticketCount: tickets.length,
        tickets,
      });
      const { error } = await supabase.from("WebinarTickets").insert(tickets);

      if (error) {
        throw new Error(`Failed to create webinar tickets: ${error.message}`);
      }
    }
  } catch (error) {
    Logger.ERROR("Error in createWebinarTickets", {
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
            }
          : "Unknown error",
      purchaseId,
      userId,
      basketItems,
    });
    throw error;
  }
}
