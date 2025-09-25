import {
  type BasketItem,
  PRODUCT_TYPE,
  type ProductType,
} from "../../types/basket-item.ts";
import type { User } from "../../types/user";
import {
  META_BASKET_PRODUCT_TYPE, META_EVENT_TYPE,
  type MetaBasketProductType,
  type MetaEventType,
  sendPixelAddToBasketOrInitiateCheckoutEvent
} from "./metaPixel.ts";

export const trackAddToBasketEvent = async (
  basketItems: BasketItem[],
  couponCode?: string,
): Promise<void> => {
  trackEvent(META_EVENT_TYPE.ADD_TO_BASKET, basketItems, undefined, couponCode);
};

export const trackInitiateCheckoutEvent = async (
  basketItems: BasketItem[],
  userDetails?: User,
  couponCode?: string,
): Promise<void> => {
  trackEvent(META_EVENT_TYPE.INITIATE_CHECKOUT, basketItems, userDetails, couponCode);
};


export const trackPurchaseEvent = async (
  basketItems: BasketItem[],
  userDetails?: User,
  couponCode?: string,
): Promise<void> => {
  trackEvent(META_EVENT_TYPE.PURCHASE, basketItems, userDetails, couponCode);
};

const trackEvent = async (
  eventType: MetaEventType,
  basketItems: BasketItem[],
  userDetails?: User,
  couponCode?: string,
): Promise<void> => {

  if (basketItems.length === 0) {
    console.log(
      "TRACK EVENT: No basket items found, skipping tracking",
    );
    return;
  }

  // Don't track InitiateCheckout or Purchase without user details
  if ((eventType === META_EVENT_TYPE.INITIATE_CHECKOUT || eventType === META_EVENT_TYPE.PURCHASE) && !userDetails) {
    console.log(
      "TRACK EVENT: No user details found, skipping tracking for event type:" + eventType);
    return;
  }

  const generateEventId = () => {
    const basketItemIds = basketItems
      .map((item) => item.id)
      .sort()
      .join("-");
    const couponSuffix = couponCode ? `coupon-${couponCode}` : "";
    return `${eventType}-${basketItemIds}-${couponSuffix}`;
  };

  const eventId = generateEventId();

  // Check if we've already tracked this exact combination
  if (sessionStorage.getItem(eventId)) {
    return;
  }

  sessionStorage.setItem(eventId, "true");

  const cart = basketItems.map((item) => ({
    id: item.id,
    quantity: 1,
    item_price: item.discountedPriceInPence / 100,
    content_type: item.product_type as ProductType,
  }));

  // Determine overall content_type based on cart contents
  const contentType: MetaBasketProductType = cart.every(
    (item) => item.content_type === PRODUCT_TYPE.WEBINAR,
  )
    ? META_BASKET_PRODUCT_TYPE.WEBINARS
    : cart.every((item) => item.content_type === PRODUCT_TYPE.COURSE)
      ? META_BASKET_PRODUCT_TYPE.COURSES
      : META_BASKET_PRODUCT_TYPE.MIXED;

  const eventData = {
    value: cart.reduce((sum, item) => sum + item.item_price * item.quantity, 0),
    currency: "GBP",
    contents: cart,
    content_type: contentType,
  };

  sendPixelAddToBasketOrInitiateCheckoutEvent(eventType, eventData, {
    eventID: eventId,
  });

  sendToCAPI(eventType, eventId, userDetails, cart, eventData);
};

const sendToCAPI = async (
  eventName: string,
  eventId: string,
  userDetails: User | undefined,
  cart,
  eventData,
) => {
  // Send CAPI event
  // Get IP then send CAPI event
  fetch("/api/get-ip")
    .then((r) => r.text())
    .then((clientIp) => {
      fetch("/api/meta-capi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_name: eventName,
          event_id: eventId,
          event_source_url: window.location.href,
          client_ip: clientIp,
          client_user_agent: navigator.userAgent,
          em: userDetails?.email,
          fn: userDetails?.first_name,
          ln: userDetails?.surname,
          custom_data: {
            currency: eventData.currency,
            value: eventData.value.toString(),
            content_ids: cart.map((item) => item.id),
            contents: cart.map((item) => ({
              id: item.id,
              quantity: item.quantity,
              item_price: item.item_price.toString(),
            })),
          },
        }),
      });
    })
    .catch((error) => {
      console.error("Error sending CAPI event:", error);
    });
};
