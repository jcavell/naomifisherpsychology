import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { type Appearance, loadStripe } from "@stripe/stripe-js";
import CheckoutCompleteComponent from "./CheckoutCompleteComponent.tsx";
import { CartProvider } from "react-use-cart";

// Load stripe with our TEST publishable API key (pk....)
const stripePublishableKey = import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(stripePublishableKey);

const CheckoutCompleteWrapper: React.FC = () => {
  const appearance: Appearance = {
    theme: "stripe",
  };

  return (
    <div className="checkout-complete-wrapper">
      {/* Wrap CheckoutCompleteComponent within Elements */}
      <Elements stripe={stripePromise} options={{ appearance }}>
        <CartProvider id="website">
          <CheckoutCompleteComponent />
        </CartProvider>
      </Elements>
    </div>
  );
};

export default CheckoutCompleteWrapper;
