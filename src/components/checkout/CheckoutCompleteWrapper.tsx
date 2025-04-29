import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { type Appearance, loadStripe } from "@stripe/stripe-js";
import CheckoutCompleteComponent from "./CheckoutCompleteComponent.tsx";

// Load stripe with our TEST publishable API key (pk....)
const stripePublishableKey = import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(stripePublishableKey);

const CheckoutCompleteWrapper: React.FC = () => {
  const appearance: Appearance = {
    theme: "stripe",
  };

  return (
      <Elements stripe={stripePromise} options={{ appearance }}>
          <CheckoutCompleteComponent />
      </Elements>
  );
};

export default CheckoutCompleteWrapper;
