import React, { useState, useEffect } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import type { Appearance, Stripe, PaymentRequest } from "@stripe/stripe-js";
import type { Elements } from "@stripe/react-stripe-js";

import formStyles from "../../styles/components/checkout/form.module.css";
import paymentStyles from "../../styles/components/checkout/payment.module.css";
import summaryStyles from "../../styles/components/checkout/summary.module.css";
import type { BasketItem } from "../../types/basket-item..ts";
import type { User } from "../../types/user";
import { getTrackerFromStore } from "../../scripts/tracking/trackerRetrieverAndStorer.ts";
import { getCouponCodeFromStore } from "../../scripts/coupon/couponRetrieverAndStorer.ts";
import { TermsNewsletterSubmitComponent } from "./TermsNewsletterSubmitComponent.tsx";
import CryptoJS from 'crypto-js';

type PaymentMethod = "paypal" | "apple_pay" | "google_pay" | "card";

interface StripePaymentComponentProps {
  userDetails: User;
  basketItems: BasketItem[];
  setError: (error: string | null) => void;
  onPaymentMethodSelect?: (method: PaymentMethod) => void;
  selectedPaymentMethod?: PaymentMethod;
  showButtonsOnly?: boolean;
}

const StripePaymentButtons: React.FC<{
  onPaymentMethodSelect: (method: PaymentMethod) => void;
  basketItems: BasketItem[];
  userDetails: User;
  setError: (error: string | null) => void;
}> = ({ onPaymentMethodSelect, basketItems, userDetails, setError }) => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [canMakePayment, setCanMakePayment] = useState(false);

  useEffect(() => {
    if (!stripe) return;

    const totalAmount = basketItems.reduce(
      (sum, item) => sum + item.discountedPriceInPence,
      0
    );

    const pr = stripe.paymentRequest({
      country: 'GB',
      currency: 'gbp',
      total: {
        label: 'Total',
        amount: totalAmount,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    // Handle payment method events
    pr.on('paymentmethod', async (event) => {
      try {
        // Create payment intent for Apple/Google Pay
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: basketItems,
            t: getTrackerFromStore(),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create payment intent");
        }

        const { clientSecret } = await response.json();

        const { paymentIntent, error } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: event.paymentMethod.id,
          }
        );

        if (error) {
          event.complete('fail');
          setError(error.message || "Payment failed");
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          event.complete('success');

          // Process the payment
          const processResponse = await fetch("/api/sb-insert-unconfirmed-purchase", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              payment_intent_id: paymentIntent.id,
              t: getTrackerFromStore(),
              coupon_code: getCouponCodeFromStore(),
              basket_items: basketItems,
              user: {
                ...userDetails,
                subscribed_to_marketing: false, // Default for quick payments
              },
            }),
          });

          if (processResponse.ok) {
            sessionStorage.setItem(paymentIntent.id, JSON.stringify(basketItems));
            window.location.href = `${window.location.origin}/checkout-complete?checkout_id=${paymentIntent.id}&redirect_status=succeeded`;
          } else {
            setError("Payment processing failed");
          }
        }
      } catch (error) {
        event.complete('fail');
        setError(error instanceof Error ? error.message : "Payment failed");
      }
    });

    pr.canMakePayment().then(result => {
      setCanMakePayment(!!result);
    });

    setPaymentRequest(pr);
  }, [stripe, basketItems, userDetails, setError]);

  return (
    <>
      {canMakePayment && paymentRequest && (
        <div className={paymentStyles.paymentMethodButton}>
          <PaymentRequestButtonElement
            options={{
              paymentRequest,
              style: {
                paymentRequestButton: {
                  type: 'default',
                  theme: 'dark',
                  height: '48px',
                },
              },
            }}
          />
        </div>
      )}

      <button
        className={paymentStyles.paymentMethodButton}
        onClick={() => onPaymentMethodSelect("card")}
      >
        <span className={paymentStyles.paymentMethodIcon}>💳</span>
        Pay with Card
      </button>
    </>
  );
};

const StripeCardForm: React.FC<{
  userDetails: User;
  basketItems: BasketItem[];
  setError: (error: string | null) => void;
  clientSecret: string;
}> = ({ userDetails, basketItems, setError, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isCardNumberComplete, setIsCardNumberComplete] = useState(false);
  const [isCardExpiryComplete, setIsCardExpiryComplete] = useState(false);
  const [isCardCvcComplete, setIsCardCvcComplete] = useState(false);
  const [cardNumberError, setCardNumberError] = useState<string | null>(null);
  const [cardExpiryError, setCardExpiryError] = useState<string | null>(null);
  const [cardCvcError, setCardCvcError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isPaymentComplete =
    isCardNumberComplete && isCardExpiryComplete && isCardCvcComplete;

  const stripeElementStyle = {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  };

  const processStripePayment = async (paymentId: string, formData: any) => {
    try {
      const response = await fetch("/api/sb-insert-unconfirmed-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_intent_id: paymentId,
          t: getTrackerFromStore(),
          coupon_code: getCouponCodeFromStore(),
          basket_items: basketItems,
          user: {
            ...userDetails,
            kit_subscriber_id: formData.kitSubscriberId,
            subscribed_to_marketing: formData.receiveUpdates,
          },
        }),
      });

      if (!response.ok) {
        throw new Error((await response.json()).message);
      }

      sessionStorage.setItem(paymentId, JSON.stringify(basketItems));
      window.location.href = `${window.location.origin}/checkout-complete?checkout_id=${paymentId}&redirect_status=succeeded`;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Payment failed");
      return false;
    }
    return true;
  };

  const handleCardPayment = async (formData: any) => {
    if (!stripe || !elements || !clientSecret) {
      setMessage("Payment system not ready");
      return false;
    }

    setIsLoading(true);

    // Clear any existing errors
    setCardNumberError(null);
    setCardExpiryError(null);
    setCardCvcError(null);
    setMessage(null);

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
      setCardNumberError("Card details are required");
      setIsLoading(false);
      return false;
    }

    const { paymentIntent, error } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${userDetails.first_name} ${userDetails.surname}`,
            email: userDetails.email,
          },
        },
      },
    );

    if (paymentIntent && paymentIntent.status === "succeeded") {
      const success = await processStripePayment(paymentIntent.id, formData);
      setIsLoading(false);
      return success;
    }

    if (error) {
      const errorMessage = error.message || "Invalid card details";
      switch (error.code) {
        case "card_number_incomplete":
          setCardNumberError(errorMessage);
          break;
        case "card_expiry_incomplete":
          setCardExpiryError(errorMessage);
          break;
        case "card_cvc_incomplete":
          setCardCvcError(errorMessage);
          break;
        default:
          setMessage(errorMessage);
      }
    }

    setIsLoading(false);
    return false;
  };

  return (
    <>
      <h2>Card Payment</h2>

      <div className={paymentStyles.paymentElement}>
        <div className={paymentStyles.cardElement}>
          <label>Card Number</label>
          <CardNumberElement
            options={{ style: stripeElementStyle }}
            onChange={(event) => {
              setIsCardNumberComplete(event.complete);
              setCardNumberError(null);
            }}
          />
          {cardNumberError && (
            <div className={formStyles.error}>{cardNumberError}</div>
          )}
        </div>

        <div className={paymentStyles.cardRow}>
          <div className={paymentStyles.cardElement}>
            <label>Expiration Date</label>
            <CardExpiryElement
              options={{ style: stripeElementStyle }}
              onChange={(event) => {
                setIsCardExpiryComplete(event.complete);
                setCardExpiryError(null);
              }}
            />
            {cardExpiryError && (
              <div className={formStyles.error}>{cardExpiryError}</div>
            )}
          </div>

          <div className={paymentStyles.cardElement}>
            <label>CVC</label>
            <CardCvcElement
              options={{ style: stripeElementStyle }}
              onChange={(event) => {
                setIsCardCvcComplete(event.complete);
                setCardCvcError(null);
              }}
            />
            {cardCvcError && (
              <div className={formStyles.error}>{cardCvcError}</div>
            )}
          </div>
        </div>
      </div>

      {message && <div className={formStyles.error}>{message}</div>}

      <TermsNewsletterSubmitComponent
        userDetails={userDetails}
        onSubmit={handleCardPayment}
        isLoading={isLoading}
        disabled={!stripe || !isPaymentComplete}
        submitText="Pay Now"
      />
    </>
  );
};

export const StripePaymentComponent: React.FC<StripePaymentComponentProps> = (
  props,
) => {
  const [paymentReady, setPaymentReady] = useState({
    Elements: null as typeof Elements | null,
    stripe: null as Promise<Stripe | null> | null,
    clientSecret: null as string | null,
  });

  useEffect(() => {
    loadStripeAndCreateIntent();
  }, []);

  const createBasketHash = (items: BasketItem[]): string => {
    return CryptoJS.SHA256(JSON.stringify(items)).toString();
  };

  const loadStripeAndCreateIntent = async () => {
    try {
      // Load Stripe
      if (!paymentReady.Elements || !paymentReady.stripe) {
        const [stripeJs, reactStripeJs] = await Promise.all([
          import("@stripe/stripe-js"),
          import("@stripe/react-stripe-js"),
        ]);

        const { loadStripe } = stripeJs;
        const stripePromise = loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY);

        setPaymentReady({
          Elements: reactStripeJs.Elements,
          stripe: stripePromise,
          clientSecret: null, // Will be set when needed for card payments
        });
      }

      // Only create payment intent if we need it for card payments
      if (!props.showButtonsOnly && props.selectedPaymentMethod === "card") {
        // Create new payment intent for card payments
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: props.basketItems,
            t: getTrackerFromStore(),
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();

        setPaymentReady(prev => ({
          ...prev,
          clientSecret: data.clientSecret,
        }));
      }
    } catch (error) {
      console.error("Failed to load Stripe:", error);
      props.setError(
        error.message || "Failed to load payment system. Please try again.",
      );
    }
  };

  if (!paymentReady.Elements || !paymentReady.stripe) {
    return <p className={summaryStyles.emptyCart}>Loading payment system...</p>;
  }

  const appearance: Appearance = {
    theme: "stripe",
  };

  // Show only payment method buttons
  if (props.showButtonsOnly && props.onPaymentMethodSelect) {
    return (
      <paymentReady.Elements
        options={{ appearance }}
        stripe={paymentReady.stripe}
      >
        <StripePaymentButtons
          onPaymentMethodSelect={props.onPaymentMethodSelect}
          basketItems={props.basketItems}
          userDetails={props.userDetails}
          setError={props.setError}
        />
      </paymentReady.Elements>
    );
  }

  // Show card payment form
  if (props.selectedPaymentMethod === "card" && paymentReady.clientSecret) {
    return (
      <paymentReady.Elements
        options={{ clientSecret: paymentReady.clientSecret, appearance }}
        stripe={paymentReady.stripe}
      >
        <StripeCardForm
          userDetails={props.userDetails}
          basketItems={props.basketItems}
          setError={props.setError}
          clientSecret={paymentReady.clientSecret}
        />
      </paymentReady.Elements>
    );
  }

  return <p className={summaryStyles.emptyCart}>Loading...</p>;
};