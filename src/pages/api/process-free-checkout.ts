import type { User } from "../../types/user";
import type { BasketItem } from "../../types/basket-item";
import { upsertUser } from "./sb-users.ts";
import { insertWebinarTickets } from "./sb-webinar-tickets.ts";
import { sendPurchaseConfirmationAndSubToKit } from "./send-purchase-confirmation.ts";
import Logger from "../../scripts/logger.ts";

export const prerender = false;

export const POST = async ({ request }) => {
  try {
    const { user, basket_items } = await request.json();

    if (!user || !basket_items) {
      return new Response(
        JSON.stringify({ message: "Missing user or basket items data" }),
        { status: 400 },
      );
    }

    // Validate that all items are actually free
    const hasNonFreeItems = basket_items.some((item) => item.price !== 0);
    if (hasNonFreeItems) {
      return new Response(
        JSON.stringify({
          message: "Cannot process paid items through free checkout",
        }),
        { status: 400 },
      );
    }

    const result = await processFreeCheckout(user, basket_items);

    return new Response(
      JSON.stringify({ success: true, userId: result.userId }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    Logger.ERROR("API: Failed to process free checkout:", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return new Response(
      JSON.stringify({
        success: false,
        message: "An error occurred while processing your request",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};

async function processFreeCheckout(user: User, basketItems: BasketItem[]) {
  try {
    // Step 1: Insert/Update user in the database
    const upsertedUser = await upsertUser(user);

    if (!upsertedUser?.id) {
      throw new Error("Failed to create/update user");
    }

    // Step 2: Create webinar tickets
    await insertWebinarTickets(
      null, // No purchase ID for free items
      basketItems,
      upsertedUser.id,
    );

    // Step 3: Send confirmation email and handle Kit subscription
    await sendPurchaseConfirmationAndSubToKit(
      user,
      "FREE", // No payment intent for free items
      0, // Amount is 0 for free items
      basketItems,
    );

    return {
      success: true,
      userId: upsertedUser.id,
    };
  } catch (error) {
    Logger.ERROR("Failed to process free checkout:", {
      error: error instanceof Error ? error.message : "Unknown error",
      user,
      basketItems,
    });
    throw error;
  }
}
