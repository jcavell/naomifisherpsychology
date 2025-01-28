import React, { useState, useEffect } from "react";
import { CartProvider, useCart } from "react-use-cart";
import styles from "./Cart.module.css"; // Modular CSS for styles
import { type Appearance, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm.tsx";
import "./Checkout.css";

// Load stripe with our TEST publishable API key (pk....)
const stripePublishableKey = import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(stripePublishableKey);

const Checkout: React.FC = () => {
  const { isEmpty, cartTotal, items, removeItem, emptyCart } = useCart();
  const [isHydrated, setIsHydrated] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null); // Track clientSecret for Stripe initialization

  const formatPrice = (valueInPence: number): string => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(valueInPence / 100);
  };

  // Ensure the cart is fully hydrated before rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 0); // Defer hydration check to the next tick
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isHydrated && !isEmpty) {
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
  }, [isHydrated, isEmpty, items]); // Run whenever hydration or cart state changes

  // Early UI return for loading or empty states
  if (!isHydrated) {
    return <p className={styles.emptyCart}>Loading your cart...</p>;
  }

  if (isEmpty) {
    return <p className={styles.emptyCart}>Your basket is empty</p>;
  }

  const appearance: Appearance = {
    theme: "stripe",
  };
  // Enable the skeleton loader UI for optimal loading.
  const loader = "auto";

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.cartAndCheckout}>
        <div className={styles.cartContainer}>
          <div className={styles.cartHeadings}>
            <span>Webinar</span>
            <span>Ticket</span>
            <span>Price</span>
          </div>

          <ul className={styles.cartItems}>
            {items.map((item) => (
              <li key={item.id} className={styles.cartItem}>
                <span className={styles.itemColumn}>{item.product_name}</span>
                <span className={styles.itemColumn}>{item.variant_name}</span>
                <span className={styles.itemColumn}>
                  {formatPrice(item.price)}
                </span>
                <button
                  className={styles.removeButton}
                  onClick={() => removeItem(item.id)}
                >
                  Remove &times;
                </button>
              </li>
            ))}
          </ul>
          <div className={styles.cartSummary}>
            Total: <strong>{formatPrice(cartTotal)}</strong>
          </div>
        </div>

        {clientSecret && (
          <div className={styles.checkoutFormWrapper}>
            <Elements
              options={{ clientSecret, appearance }}
              stripe={stripePromise}
            >
              <CheckoutForm />
            </Elements>
          </div>
        )}
      </div>
    </div>
  );
};

const CheckoutComponent: React.FC = () => {
  return (
    <CartProvider id="website">
      <Checkout />
    </CartProvider>
  );
};

export default CheckoutComponent;
