import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useCart, CartProvider } from "react-use-cart";

const CheckoutForm = () => {
  const stripePromise = loadStripe(
    "pk_test_51QYVqyReZarnNjSdXTVkgrinPbJQp3aD1HQ3MJctPLTBw3X3j51veVbxDOOPK8jDGHwCSCKJTlsN6osGFfNggqIB003lu3X1Ju",
  );
  const { items } = useCart();

  console.log("CHECKOUT.TSX ITEMS: " + JSON.stringify(items));

  const lineItems = items.map((item) => {
    return { price: item.id, quantity: 1 };
  });

  const fetchClientSecret = useCallback(() => {
    // alert("Submitting with line items: " + JSON.stringify(lineItems));
    return fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ line_items: lineItems }),
    })
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

const CheckoutComponent: React.FC = () => {
  return (
    <CartProvider id="website">
      <CheckoutForm />
    </CartProvider>
  );
};

export default CheckoutComponent;
