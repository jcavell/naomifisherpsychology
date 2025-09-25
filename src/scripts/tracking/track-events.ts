import { type BasketItem, type ProductType } from "../../types/basket-item.ts";
import type { User } from "../../types/user";
import {
  type PixelEventName,
  type PixelContentItem,
  type PixelEvent,
  sendPixelEvent,
  PIXEL_EVENT_NAME,
} from "./metaPixel.ts";
import type { MetaCAPIRequestBody } from "../../pages/api/meta-capi.ts";

export const prerender = false;

interface TrackEventParams {
  eventName: PixelEventName;
  basketItems: BasketItem[];
  paymentIntentId?: string;
  userDetails?: User;
}

const trackEvent = async ({
  eventName,
  basketItems,
  paymentIntentId,
  userDetails,
}: TrackEventParams): Promise<void> => {
  if (basketItems.length === 0) {
    console.log("TRACK EVENT: No basket items found, skipping tracking");
    return;
  }

  // Don't track InitiateCheckout or Purchase without user details
  if (
    (eventName === PIXEL_EVENT_NAME.INITIATE_CHECKOUT ||
      eventName === PIXEL_EVENT_NAME.PURCHASE) &&
    !userDetails
  ) {
    console.log(
      "TRACK EVENT: No user details found, skipping tracking for event type:" +
        eventName,
    );
    return;
  }

  // Generate a unique id to correlate pixel and CAPI events
  const generateEventId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const userIdPrefix = userDetails?.id ? `-user-${userDetails.id}` : "";
    return `${eventName}-${userIdPrefix}-${timestamp}-${random}`;
  };

  const eventId = generateEventId();

  const pixelContents: PixelContentItem[] = basketItems.map((item) => ({
    id: item.id,
    quantity: 1,
    item_price: item.discountedPriceInPence / 100,
    category: item.product_type as ProductType,
  }));

  const pixelEvent: PixelEvent = {
    num_items: basketItems.length,
    content_type: "product",
    content_category: "Digital Products",
    content_ids: basketItems.map((item) => item.id),
    value: pixelContents.reduce(
      (sum, item) => sum + item.item_price * item.quantity,
      0,
    ),
    currency: "GBP",
    contents: pixelContents,
    order_id: paymentIntentId,
  };

  sendPixelEvent(eventId, eventName, pixelEvent);
  sendToCAPI(eventId, eventName, pixelEvent, userDetails);
};

const sendToCAPI = async (
  eventId: string,
  eventName: PixelEventName,
  pixelEvent: PixelEvent,
  userDetails?: User,
) => {
  // Send Meta CAPI event
  const metaCAPIRequestBody: MetaCAPIRequestBody = {
    event_name: eventName,
    event_id: eventId,
    event_source_url: window.location.href,
    client_user_agent: navigator.userAgent,
    userDetails: userDetails,
    pixelEvent: pixelEvent,
  };

  fetch("/api/meta-capi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(metaCAPIRequestBody),
  }).catch((error) => {
    console.error("Error sending CAPI event:", error);
  });
};

export const trackAddToBasketEvent = async (
  basketItem: BasketItem,
): Promise<void> => {
  trackEvent({
    eventName: PIXEL_EVENT_NAME.ADD_TO_CART,
    basketItems: [basketItem],
  });
};

export const trackInitiateCheckoutEvent = async (
  basketItems: BasketItem[],
  userDetails?: User,
): Promise<void> => {
  trackEvent({
    eventName: PIXEL_EVENT_NAME.INITIATE_CHECKOUT,
    basketItems,
    userDetails,
  });
};

export const trackPurchaseEvent = async (
  basketItems: BasketItem[],
  paymentIntentId?: string,
  userDetails?: User,
): Promise<void> => {
  trackEvent({
    eventName: PIXEL_EVENT_NAME.PURCHASE,
    basketItems,
    paymentIntentId,
    userDetails,
  });
};
