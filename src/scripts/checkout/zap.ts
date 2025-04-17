import type { BasketItem } from "../../types/basket-item";
import type { User } from "../../types/user";
import { getInternalIdFromOfferId } from "../course-get-internal-id.ts";
import Logger from "../logger";
import { env } from "../env.ts";

const ZAPIER_WEBHOOK_URL = env.ZAPIER_WEBHOOK_URL;

export async function postCoursesToZapier(
  userId: any,
  user: User,
  courseBasketItems: BasketItem[],
) {
  if (courseBasketItems.length === 0) {
    Logger.INFO("No courses found in purchase, skipping Zapier webhook");
    return;
  }

  // Get internal IDs for all courses
  const internalIds = courseBasketItems.map((item) =>
    getInternalIdFromOfferId(item.id),
  );

  if (internalIds.length === 0) {
    Logger.INFO("No matching course IDs found, skipping Zapier webhook");
    return;
  }

  const zapierPayload = {
    data: {
      email: user.email,
      firstName: user.first_name,
      lastName: user.surname,
      offerIds: internalIds,
      userId: userId,
    },
  };

  Logger.INFO("Posting courses to Zapier webhook", { zapierPayload });

  try {
    const response = await fetch(ZAPIER_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(zapierPayload),
    });

    if (!response.ok) {
      throw new Error(`Zapier webhook failed: ${response.statusText}`);
    }

    Logger.INFO(`Successfully posted ${internalIds.length} courses to Zapier`);
  } catch (error) {
    Logger.ERROR("Failed to post to Zapier webhook:", error);
    throw error;
  }
}
