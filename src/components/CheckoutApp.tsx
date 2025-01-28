import React, { useState, useEffect } from "react";
import { CartProvider, useCart } from "react-use-cart";
import { type Appearance, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutItemsSummary from "./CheckoutOrderSummary.tsx";
import calculateOrderAmount from "../scripts/calculateOrderAmount.ts";

import CheckoutForm from "./CheckoutForm";
import "./Checkout.css";
import type { CheckoutItem } from "../types/checkoutItem";

// Load stripe with our TEST publishable API key (pk....)
const stripePublishableKey = import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(stripePublishableKey);

export default function CheckoutApp() {
  const { items } = useCart();
  const checkoutItems = items as CheckoutItem[]; // Cast item to CheckoutItem
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    if (items.length > 0) {
      console.log("All items have been loaded:", items);
      setIsLoading(false); // Loading complete, proceed to API call

      console.log("Fetching clientSecret begins...");
      // Create PaymentIntent as soon as the page loads
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: checkoutItems }),
      })
        .then((res) => {
          console.log("Response received:", res);
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          // console.log("DATA received from /api/create-payment-intent:", data);
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            //  console.error("No clientSecret found in the response.");
          }
        })
        .catch((error) => {
          console.error(
            "Error occurred while fetching clientSecret:",
            error.message,
          );
        });
    } else {
      console.log("Waiting for cart items to load...");
    }
  }, [items]);

  const appearance: Appearance = {
    theme: "stripe",
  };
  // Enable the skeleton loader UI for optimal loading.
  const loader = "auto";

  return (
    <CartProvider id="website">
      <div className="App">
        {clientSecret ? (
          <>
            {/* Render the order summary above the checkout form */}
            <CheckoutItemsSummary
              items={checkoutItems}
              total={calculateOrderAmount(checkoutItems)}
            />
            <Elements
              options={{ clientSecret, appearance }}
              stripe={stripePromise}
            >
              <CheckoutForm />
            </Elements>
          </>
        ) : (
          <p>Loading payment form...</p>
        )}
      </div>
    </CartProvider>
  );
}
