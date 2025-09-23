import React, { useState, useEffect } from "react";
import { type Appearance, loadStripe, type Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Basket } from "../basket/Basket.tsx";
import { UserDetailsForm } from "./UserDetailsForm.tsx";
import { PaymentForm } from "./PaymentForm.tsx";
import { useClientOnly } from "../../scripts/basket/use-client-only-hook.ts";

import formStyles from "../../styles/components/checkout/form.module.css";
import summaryStyles from "../../styles/components/checkout/summary.module.css";
import cartStyles from "../../styles/components/cart/cart.module.css";
import { useStore } from "@nanostores/react";
import { getBasketItems, getIsEmpty } from "../../scripts/basket/basket.ts";
import type { User } from "../../types/user";
import { getTrackerFromStore } from "../../scripts/tracking/trackerRetrieverAndStorer.ts";

const Spinner: React.FC = () => (
  <div className={formStyles.spinnerContainer}>
    <div className={formStyles.spinner}></div>
  </div>
);

const Checkout: React.FC<{ setError: (error: string | null) => void }> = ({
  setError,
}) => {
  const $basketItems = useStore(getBasketItems);
  const $isEmpty = useStore(getIsEmpty);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string>(""); // Passed to PaymentForm

  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);

  // Initialize Stripe when component mounts, not waiting for payment intent
  useEffect(() => {
    if (!stripePromise && !isBasketFree($basketItems)) {
      const promise = loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY);
      setStripePromise(promise);
    }
  }, []);

  const isBasketFree = (items: any[]): boolean => {
    return items.every((item) => item.price === 0);
  };

  const createPaymentIntent = async () => {
    if ($basketItems.length > 0 && !isBasketFree($basketItems)) {
      try {
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: $basketItems,
            t: getTrackerFromStore(),
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.error || `HTTP error! Status: ${res.status}`,
          );
        }

        const data = await res.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.clientSecret.split('_secret_')[0]);
        } else {
          throw new Error("No clientSecret in response");
        }
      } catch (error) {
        console.error("Failed to fetch client secret: ", error);
        setError(
          error.message || "Failed to process payment. Please try again.",
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
          paymentIntentId={paymentIntentId}
          userDetails={userDetails}
          basketItems={$basketItems}
        />
      </div>
    );
  }

  // Show loading state while waiting for clientSecret for paid items
  if (!clientSecret) {
    return (
      <div className={summaryStyles.emptyCart}>
        <Spinner />
        <p>Loading payment form...</p>
      </div>
    );
  }

  const appearance: Appearance = {
    theme: "stripe",
  };

  return (
    <div className={formStyles.checkoutFormWrapper}>
      <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
        <PaymentForm
          paymentIntentId={paymentIntentId}
          userDetails={userDetails}
          basketItems={$basketItems}
        />{" "}
      </Elements>
    </div>
  );
};

const CheckoutComponent: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const isClient = useClientOnly(); // Also moved inside the component

  if (!isClient) {
    return null; // Return nothing during SSR
  }
  return (
    <div className={cartStyles.cartAndCheckout}>
      {error && <div className={formStyles.error}>{error}</div>}
      <Basket isCheckoutPage={true} basketTitle={"Order Summary"} />
      <Checkout setError={setError} />
    </div>
  );
};

export default CheckoutComponent;
