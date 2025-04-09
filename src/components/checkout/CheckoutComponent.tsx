import React, { useState, useEffect } from "react";
import { CartProvider, useCart } from "react-use-cart";
import { type Appearance, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm.tsx";
import { Basket } from "../basket/Basket.tsx";

import formStyles from "../../styles/components/checkout/form.module.css";
import paymentStyles from "../../styles/components/checkout/payment.module.css";
import summaryStyles from "../../styles/components/checkout/summary.module.css";

// Load stripe with our TEST publishable API key (pk....)
const stripePublishableKey = import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(stripePublishableKey);

const Checkout: React.FC = () => {
  const { isEmpty, cartTotal, items, removeItem, emptyCart, updateItem } =
    useCart();
  const [isHydrated, setIsHydrated] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null); // Track clientSecret for Stripe initialization

  const isBasketFree = (items: any[]): boolean => {
    return items.every((item) => item.price === 0);
  };

  // Ensure the cart is fully hydrated before rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 0); // Defer hydration check to the next tick
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isHydrated && items.length > 0 && !isBasketFree(items)) {
      console.log(
        "Calling create-payment-intent with Items: ",
        JSON.stringify(items),
      );
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
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
  }, [isHydrated, items]); // Run whenever hydration or items changes

  // Early UI return for loading or empty states
  if (!isHydrated) {
    return <p className={summaryStyles.emptyCart}>Loading shopping basket.</p>;
  }

  if (isEmpty) {
    return;
  }

  // For free items, render CheckoutForm without Stripe Elements
  if (isBasketFree(items)) {
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

  // Enable the skeleton loader UI for optimal loading.
  const loader = "auto";

  return (
    clientSecret && (
      <div className={formStyles.checkoutFormWrapper}>
        <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      </div>
    )
  );
};

const CheckoutComponent: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [isStylesLoaded, setIsStylesLoaded] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures this component renders only on the client
    // Small delay to ensure CSS is loaded and parsed
    requestAnimationFrame(() => {
      setIsStylesLoaded(true);
    });
  }, []);

  if (!isClient) {
    return null; // Return nothing during SSR to prevent mismatched HTML
  }
  return (
    <CartProvider id="website">
      <div
        className={`${paymentStyles.cartAndCheckout} ${isStylesLoaded ? paymentStyles.loaded : paymentStyles.loading}`}
        aria-busy={!isStylesLoaded}
      >
        {" "}
        <Basket showCheckoutButton={false} />
        <Checkout />
      </div>
    </CartProvider>
  );
};

export default CheckoutComponent;
