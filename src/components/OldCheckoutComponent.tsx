import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useCart, CartProvider } from "react-use-cart";

const getLineItems = () => {
  return [
    {
      price_data: {
        currency: "GBP",
        product_data: {
          name: "Low Pressure Parenting for Teens with Dr Naomi Fisher & Eliza Fricker",
          description:
            "Being (and having) a teen is demanding. What is low demand parenting for teens, and how can we help our pressure sensitive teens thrive?",
          images: [
            "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F920259243%2F137448283838%2F1%2Foriginal.20241219-114709?w=940&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C2160%2C1080&s=489895f5279f54d0b1d746943c90ee31",
          ], // Array of public product image URLs
          metadata: {
            category: "webinar",
            id: "1118800224589",
          },
        },
        unit_amount: 2500, // Amount in cents ($25.00)
      },
      quantity: 1, // Two units of this item
      adjustable_quantity: {
        enabled: false, // Allow customers to increase/decrease quantity during checkout
      },
    },
  ];
};

const CheckoutForm = () => {
  const stripePromise = loadStripe(
    "pk_test_51QYVqyReZarnNjSdXTVkgrinPbJQp3aD1HQ3MJctPLTBw3X3j51veVbxDOOPK8jDGHwCSCKJTlsN6osGFfNggqIB003lu3X1Ju",
  );
  const { items } = useCart();

  console.log("CHECKOUT.TSX ITEMS: " + JSON.stringify(items));

  // const lineItems = items.map((item) => {
  //   return { price: item.id, quantity: 1 };
  // });

  const fetchClientSecret = useCallback(() => {
    // alert("Submitting with line items: " + JSON.stringify(lineItems));
    return fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ line_items: getLineItems() }),
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

const OldCheckoutComponent: React.FC = () => {
  return (
    <CartProvider id="website">
      <CheckoutForm />
    </CartProvider>
  );
};

export default OldCheckoutComponent;
