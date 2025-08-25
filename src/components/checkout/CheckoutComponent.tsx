import React, { useState, useEffect } from "react";
import { Basket } from "../basket/Basket.tsx";
import { UserDetailsForm } from "./UserDetailsForm.tsx";
import { PaymentForm } from "./PaymentForm.tsx";
import { useClientOnly } from "../../scripts/basket/use-client-only-hook.ts";

// Stripe types only - actual code is imported dynamically
import type { Appearance, Stripe } from "@stripe/stripe-js";
import type { Elements } from "@stripe/react-stripe-js";

import formStyles from "../../styles/components/checkout/form.module.css";
import summaryStyles from "../../styles/components/checkout/summary.module.css";
import cartStyles from "../../styles/components/cart/cart.module.css";
import { useStore } from "@nanostores/react";
import { getBasketItems, getIsEmpty } from "../../scripts/basket/basket.ts";
import type { User } from "../../types/user";
import { getTrackerFromStore } from "../../scripts/tracking/trackerRetrieverAndStorer.ts";
import {
  META_BASKET_PRODUCT_TYPE,
  type MetaBasketProductType,
  trackCheckoutEvent
} from "../../scripts/tracking/metaPixel.ts";
import { PRODUCT_TYPE, type ProductType } from "../../types/basket-item..ts";

const Checkout: React.FC<{ setError: (error: string | null) => void }> = ({
                                                                            setError,
                                                                          }) => {
  const $basketItems = useStore(getBasketItems);
  const $isEmpty = useStore(getIsEmpty);

  const [paymentReady, setPaymentReady] = useState({
    clientSecret: null as string | null,
    Elements: null as typeof Elements | null,
    stripe: null as Promise<Stripe | null> | null
  });

  const [userDetails, setUserDetails] = useState<User | null>(null);

  const isBasketFree = (items: any[]): boolean => {
    return items.every((item) => item.price === 0);
  };


  const createPaymentIntent = async () => {
    if ($basketItems.length > 0 && !isBasketFree($basketItems)) {
      try {
        // 1. Create payment intent and get client secret before initializing Stripe
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: $basketItems, t: getTrackerFromStore() }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();

        // Only load Stripe after we have the client secret
        if (data.clientSecret) {

          // 2. Load Stripe modules dynamically
          const [stripeJs, reactStripeJs] = await Promise.all([
            import('@stripe/stripe-js'),
            import('@stripe/react-stripe-js')
          ]);

          // 3. Initialize everything at once
          const { loadStripe } = stripeJs;
          setPaymentReady({
            clientSecret: data.clientSecret,
            Elements: reactStripeJs.Elements,
            stripe: loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY)
          });


        } else {
          throw new Error("No clientSecret in response");
        }
      } catch (error) {
        console.error("Failed to fetch client secret: ", error);
        setError(
          error.message || "Failed to process payment. Please try again."
        );
      }
    }
  };

  const handleUserDetailsComplete = async (user: User) => {
    setUserDetails(user);
    if (!isBasketFree($basketItems)) {
      await createPaymentIntent();
    }
  };

  if ($isEmpty) {
    return;
  }

  // Show user details form if we don't have user details yet
  if (!userDetails) {
    return (
      <div className={formStyles.checkoutFormWrapper}>
        <UserDetailsForm onComplete={handleUserDetailsComplete} />
      </div>
    );
  }

  // For free items, render CheckoutForm without Stripe Elements
  if (isBasketFree($basketItems)) {
    return (
      <div className={formStyles.checkoutFormWrapper}>
        <PaymentForm
          clientSecret=""
          userDetails={userDetails}
          basketItems={$basketItems}
        />
      </div>
    );
  }

  if (!paymentReady.clientSecret || !paymentReady.Elements || !paymentReady.stripe) {
    return <p className={summaryStyles.emptyCart}>Loading payment form...</p>;
  }

  const appearance: Appearance = {
    theme: "stripe",
  };

  return (
    <div className={formStyles.checkoutFormWrapper}>
      {paymentReady.Elements && paymentReady.stripe && paymentReady.clientSecret && (
        <paymentReady.Elements
          options={{ clientSecret: paymentReady.clientSecret, appearance }}
          stripe={paymentReady.stripe}
        >
          <PaymentForm
            clientSecret={paymentReady.clientSecret}
            userDetails={userDetails}
            basketItems={$basketItems}
          />
        </paymentReady.Elements>
      )}
    </div>
  );
};

const CheckoutComponent: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const isClient = useClientOnly(); // Also moved inside the component
  const $basketItems = useStore(getBasketItems);
  const [hasTracked, setHasTracked] = useState<boolean>(false);


  useEffect(() => {
    if (hasTracked || !isClient || $basketItems.length === 0) return;

    setHasTracked(true);

    if (isClient && $basketItems.length > 0) {
      const basketItemIds = $basketItems.map(item => item.id).sort().join('-');
      const eventId = `checkout-${basketItemIds}`;
      // console.log('Generated eventId:', eventId);
      if (!sessionStorage.getItem(eventId)) {

        const cart = $basketItems.map(item => ({
          id: item.id,
          quantity: 1,
          item_price: item.discountedPriceInPence / 100,
          content_type: item.product_type as ProductType
        }));

        // console.log('Cart data:', cart);

        // Determine overall content_type based on cart contents
        const contentType: MetaBasketProductType = cart.every(item => item.content_type === PRODUCT_TYPE.WEBINAR)
          ? META_BASKET_PRODUCT_TYPE.WEBINARS
          : cart.every(item => item.content_type === PRODUCT_TYPE.COURSE)
            ? META_BASKET_PRODUCT_TYPE.COURSES
            : META_BASKET_PRODUCT_TYPE.MIXED;

        const eventData = {
          value: cart.reduce((sum, item) => sum + (item.item_price * item.quantity), 0),
          currency: 'GBP',
          contents: cart,
          content_type: contentType
        };

        // console.log('Meta Pixel available:', typeof (window as any).fbq === 'function');
        trackCheckoutEvent(eventData, { eventID: eventId });

        sessionStorage.setItem(eventId, 'true');
      }
    }
  }, [isClient, $basketItems]);

  if (!isClient) {
    return null; // Return nothing during SSR
  }
  return (
    <div className={cartStyles.cartAndCheckout}>
      {error && <div className={formStyles.error}>{error}</div>}
      <Basket showCheckoutButton={false} basketTitle={"Order Summary"} />
      <Checkout setError={setError} />
    </div>
  );
};

export default CheckoutComponent;
