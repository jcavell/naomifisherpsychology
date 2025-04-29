import React, { useState, useEffect } from "react";
import { type Appearance, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm.tsx";
import { Basket } from "../basket/Basket.tsx";
import {useClientOnly} from "../../scripts/basket/use-client-only-hook.ts";

import formStyles from "../../styles/components/checkout/form.module.css";
import summaryStyles from "../../styles/components/checkout/summary.module.css";
import cartStyles from "../../styles/components/cart/cart.module.css";
import {useStore} from "@nanostores/react";
import {getBasketItems, getIsEmpty} from "../../scripts/basket/basket.ts";

// Load stripe with our TEST publishable API key (pk....)
const stripePublishableKey = import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(stripePublishableKey);

const Checkout: React.FC = () => {
  const $basketItems = useStore(getBasketItems);
  const $isEmpty = useStore(getIsEmpty);
  const isClient = useClientOnly(); // Hook to check client-side

  const [clientSecret, setClientSecret] = useState<string | null>(null); // Track clientSecret for Stripe initialization

  const isBasketFree = (items: any[]): boolean => {
    return items.every((item) => item.price === 0);
  };

  useEffect(() => {
    if (!isClient || clientSecret) return;

    if ($basketItems.length > 0 && !isBasketFree($basketItems)) {
      console.log(
        "Calling create-payment-intent with Items: ",
        JSON.stringify($basketItems),
      );
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: $basketItems }),
      })
        .then((res) => {
          if (!res.ok) {
            return Promise.reject(`HTTP error! Status: ${res.status}`);
          }
          return res.json(); // Parse response JSON
        })
        .then((data) => {
          if (data.clientSecret) {
            console.log("Received clientSecret: ", data.clientSecret);
            setClientSecret(data.clientSecret); // Set the clientSecret in state
          } else {
            console.error("No clientSecret in response");
          }
        })
        .catch((error) => {
          console.error("Failed to fetch client secret: ", error);
        });
    }
  }, [isClient, $basketItems, clientSecret]); // Run whenever hydration or items changes

  if ($isEmpty) {
    return;
  }

  // For free items, render CheckoutForm without Stripe Elements
  if (isBasketFree($basketItems)) {
    return (
      <div className={formStyles.checkoutFormWrapper}>
        <CheckoutForm clientSecret="" />
      </div>
    );
  }

  // Show loading state while waiting for clientSecret for paid items
  if (!clientSecret) {
    return <p className={summaryStyles.emptyCart}>Loading payment form.</p>;
  }

  const appearance: Appearance = {
    theme: "stripe",
  };

  return (
      <div className={formStyles.checkoutFormWrapper}>
        <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      </div>
  );
};

const CheckoutComponent: React.FC = () => {
  const isClient = useClientOnly(); // Also moved inside the component

  if (!isClient) {
    return null; // Return nothing during SSR
  }
  return (
      <div className={cartStyles.cartAndCheckout}>
        {" "}
        <Basket showCheckoutButton={false} basketTitle={"Order Summary"} />
        <Checkout />
      </div>
  );
};

export default CheckoutComponent;
