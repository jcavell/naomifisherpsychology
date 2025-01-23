import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  // State with proper TypeScript annotations
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const origin = window.location.origin;

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe hasn't loaded yet, disable form submission
      return;
    }

    setIsLoading(true);

    try {
      // Confirm payment using Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Redirect the user to this URL after payment
          return_url: `${origin}/checkout-complete`, // Use dynamic origin
        },
      });

      // Handle errors if any
      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(
            error.message || "An error occurred while processing the payment.",
          );
        } else {
          setMessage("An unexpected error occurred.");
        }
      } else {
        setMessage(null); // Clear any messages if successful
      }
    } catch (err) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Define PaymentElement options as an object (no exported type available)
  const paymentElementOptions: Record<string, string> = {
    layout: "accordion", // Customize the PaymentElement layout
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      {/* Stripe Payment Element */}
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      {/* Submit button */}
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Display error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};

export default CheckoutForm;
