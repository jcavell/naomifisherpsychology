import React, { useState, useEffect } from "react";
import { type Appearance, loadStripe } from "@stripe/stripe-js";
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

// Load stripe with our TEST publishable API key (pk....)
const stripePublishableKey = import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(stripePublishableKey);

const Checkout: React.FC<{ setError: (error: string | null) => void }> = ({
                                                                            setError,
                                                                          }) => {
  const $basketItems = useStore(getBasketItems);
  const $isEmpty = useStore(getIsEmpty);
  const isClient = useClientOnly(); // Hook to check client-side

  const [clientSecret, setClientSecret] = useState<string | null>(null); // Track clientSecret for Stripe initialization
  const [userDetails, setUserDetails] = useState<User | null>(null);

  const isBasketFree = (items: any[]): boolean => {
    return items.every((item) => item.price === 0);
  };


  const createPaymentIntent = async () => {
    if ($basketItems.length > 0 && !isBasketFree($basketItems)) {
      try {
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: $basketItems }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
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
        <PaymentForm
          clientSecret={clientSecret}
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
      <Basket showCheckoutButton={false} basketTitle={"Order Summary"} />
      <Checkout setError={setError} />
    </div>
  );
};

export default CheckoutComponent;
