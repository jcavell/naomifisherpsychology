import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QYVqyReZarnNjSdXTVkgrinPbJQp3aD1HQ3MJctPLTBw3X3j51veVbxDOOPK8jDGHwCSCKJTlsN6osGFfNggqIB003lu3X1Ju",
);

export const CheckoutForm = () => {
  const fetchClientSecret = useCallback(() => {
    return fetch("/api/create-checkout-session", { method: "POST" })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};
