import React, { useState, useEffect } from "react";
import { type Appearance, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutItemsSummary from "./CheckoutOrderSummary.tsx";
import calculateOrderAmount from "../scripts/calculateOrderAmount.ts";

import CheckoutForm from "./CheckoutForm";
import CheckoutCompleteComponent from "./CheckoutCompleteComponent.tsx";
import "./Checkout.css";
import type { LineItem } from "../scripts/LineItem.ts";

// Load stripe with our TEST publishable API key (pk....)
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(stripePublishableKey);

const getItems = (): LineItem[] => {
  return [
    {
      currency: "GBP",
      unit_amount: 1699, // Amount in pence
      quantity: 1,
      product_data: {
        id: "webinar_1118800224589",
        name: "Low Pressure Parenting for Teens with Dr Naomi Fisher & Eliza Fricker",
        description:
          "Being (and having) a teen is demanding. What is low demand parenting for teens, and how can we help our pressure sensitive teens thrive?",
        images: [
          "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F920259243%2F137448283838%2F1%2Foriginal.20241219-114709?w=940&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C2160%2C1080&s=489895f5279f54d0b1d746943c90ee31",
        ],
      },
    },
    {
      currency: "GBP",
      unit_amount: 1150, // Amount in pence
      quantity: 1,
      product_data: {
        id: "webinar_1203174349869",
        name: "Now What? Diagnosis: with Dr Naomi Fisher and Eliza Fricker",
        description:
          "Your child has been given an autism or ADHD diagnosis, but what happens next?",
        images: [
          "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F936277653%2F137448283838%2F1%2Foriginal.20250115-124944?w=940&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C2160%2C1080&s=a1327c2e8c4074c89e60e14cdc3fd2cc",
        ],
      },
    },
  ];
};

export default function CheckoutApp() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    console.log("Fetching clientSecret begins...");
    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: getItems() }),
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
  }, []);

  const appearance: Appearance = {
    theme: "stripe",
  };
  // Enable the skeleton loader UI for optimal loading.
  const loader = "auto";

  return (
    <div className="App">
      {clientSecret ? (
        <>
          {/* Render the order summary above the checkout form */}
          <CheckoutItemsSummary
            items={getItems()}
            total={calculateOrderAmount(getItems())}
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
  );
}
