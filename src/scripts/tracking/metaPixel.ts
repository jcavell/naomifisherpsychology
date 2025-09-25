import type { ProductType } from "../../types/basket-item.ts";

export const PIXEL_EVENT_NAME = {
  ADD_TO_CART: 'AddToCart',
  INITIATE_CHECKOUT: 'InitiateCheckout',
  PURCHASE: 'Purchase'
}

export type PixelEventName = typeof PIXEL_EVENT_NAME[keyof typeof PIXEL_EVENT_NAME];

interface MetaPixel {
  (
    type: string,
    eventName: string,
    params?: Record<string, any>,
    customData?: Record<string, any>
  ): void;
}

interface WindowWithPixel extends Window {
  fbq?: MetaPixel;
}

export type PixelContentItem = {
  id: string;
  quantity: number;
  item_price: number;
  category: ProductType // webinar or course
};

export type PixelEvent = {
  content_ids: string[];
  content_type: string;
  content_category: string;       // 'Online Course', 'Webinar', etc.
  value: number;
  currency: string;
  num_items: number;
  contents: PixelContentItem[];
  order_id?: string;
};

type CustomData = {
  event_id: string;
};

export const sendPixelEvent = (eventId: string, eventType: PixelEventName, event: PixelEvent): void => {

  const customData: CustomData = {event_id: eventId};

  const windowWithPixel = window as WindowWithPixel;

  if (typeof windowWithPixel.fbq === 'function') {
    try {
      windowWithPixel.fbq('track', eventType, event, customData);
    } catch (error) {
      console.error('Failed to track checkout:', error);
    }
  } else {
    console.warn('Meta Pixel (fbq) not available');
  }
};