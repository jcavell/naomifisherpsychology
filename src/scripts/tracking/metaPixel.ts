// src/scripts/tracking/meta-pixel.ts

import type { ProductType } from "../../types/basket-item";

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

type PixelEvent = {
  value: number;
  currency: string;
  contents: PixelContents[];
  content_type: MetaBasketProductType; // webinars, courses or mixed
};

type CustomData = {
  eventID: string;
};

export const trackCheckoutEvent = (event: PixelEvent, customData: CustomData): void => {
  const windowWithPixel = window as WindowWithPixel;
  if (typeof windowWithPixel.fbq === 'function') {
    windowWithPixel.fbq('track', 'InitiateCheckout', event, customData);
  }
};