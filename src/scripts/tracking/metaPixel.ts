// src/scripts/tracking/meta-pixel.ts

import type { ProductType } from "../../types/basket-item..ts";

export const META_BASKET_PRODUCT_TYPE = {
  WEBINARS: 'webinars',
  COURSES: 'courses',
  MIXED: 'mixed'
} as const;

export type MetaBasketProductType = typeof META_BASKET_PRODUCT_TYPE[keyof typeof META_BASKET_PRODUCT_TYPE];

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

type PixelContents = {
  id: string;
  quantity: number;
  item_price: number;
  content_type: ProductType // webinar or course
};

type PixelCheckoutEvent = {
  value: number;
  currency: string;
  contents: PixelContents[];
  content_type: MetaBasketProductType; // webinars, courses or mixed
};

type PixelPurchaseEvent = PixelCheckoutEvent & {
  transactionId: string;  // Additional field for purchase events
};



type CustomData = {
  eventID: string;
};

export const trackCheckoutEvent = (event: PixelCheckoutEvent, customData: CustomData): void => {
  const windowWithPixel = window as WindowWithPixel;
  console.log('Attempting to track checkout:', { event, customData });
  console.log('fbq available:', typeof windowWithPixel.fbq === 'function');

  if (typeof windowWithPixel.fbq === 'function') {
    try {
      windowWithPixel.fbq('track', 'InitiateCheckout', event, customData);
      console.log('Checkout event tracked successfully');
    } catch (error) {
      console.error('Failed to track checkout:', error);
    }
  } else {
    console.warn('Meta Pixel (fbq) not available');
  }
};

export const trackPurchaseEvent = (event: PixelPurchaseEvent, customData: CustomData): void => {
  const windowWithPixel = window as WindowWithPixel;
  console.log('Attempting to track purchase:', {
    transactionId: event.transactionId,
    value: event.value,
    currency: event.currency,
    contentType: event.content_type,
    items: event.contents.map(item => ({
      id: item.id,
      price: item.item_price,
      type: item.content_type
    })),
    eventId: customData.eventID
  });
  console.log('fbq available:', typeof windowWithPixel.fbq === 'function');

  if (typeof windowWithPixel.fbq === 'function') {
    try {
      windowWithPixel.fbq('track', 'Purchase', event, customData);
      console.log('Purchase event tracked successfully');
    } catch (error) {
      console.warn('Failed to track purchase:', error);
    }
  } else {
    console.warn('Meta Pixel (fbq) not available');
  }
};