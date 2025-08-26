import React, { useEffect, useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import formStyles from "../../styles/components/checkout/form.module.css";
import paymentStyles from "../../styles/components/checkout/payment.module.css";
import type { BasketItem } from "../../types/basket-item..ts";
import type { User } from "../../types/user";
import { getTrackerFromStore } from "../../scripts/tracking/trackerRetrieverAndStorer.ts";
import { getCouponCodeFromStore } from "../../scripts/coupon/couponRetrieverAndStorer.ts";

type PaymentMethod = "card" | "paypal";

interface CheckoutFormProps {
  clientSecret: string;
  userDetails: User;
  basketItems: BasketItem[];
}

export const PaymentForm: React.FC<CheckoutFormProps> = ({
  clientSecret,
  userDetails,
  basketItems,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isCardNumberComplete, setIsCardNumberComplete] = useState(false);
  const [isCardExpiryComplete, setIsCardExpiryComplete] = useState(false);
  const [isCardCvcComplete, setIsCardCvcComplete] = useState(false);

  const [cardNumberError, setCardNumberError] = useState<string | null>(null);
  const [cardExpiryError, setCardExpiryError] = useState<string | null>(null);
  const [cardCvcError, setCardCvcError] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isPaymentComplete =
    isCardNumberComplete && isCardExpiryComplete && isCardCvcComplete;

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [receiveUpdates, setReceiveUpdates] = useState(false);
  const [showUpdatesCheckbox, setShowUpdatesCheckbox] = useState(false);
  const [kitSubscriberId, setKitSubscriberId] = useState<string | null>(null);
  const [isCheckingKit, setIsCheckingKit] = useState(false);

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

  const isBasketFree = (items: BasketItem[]): boolean => {
    return items.every((item) => item.discountedPriceInPence === 0);
  };

  useEffect(() => {
    const checkKitSubscriber = async () => {
      setIsCheckingKit(true);
      try {
        const res = await fetch(
          `/api/get-kit-user?email=${encodeURIComponent(userDetails.email)}`,
        );
        const data = await res.json();

        if (res.ok && data.subscriber) {
          setKitSubscriberId(data.subscriber.id);
          setShowUpdatesCheckbox(false);
        } else {
          setKitSubscriberId(null);
          setShowUpdatesCheckbox(true);
        }
      } catch (error) {
        console.error("Error checking subscriber:", error);
      } finally {
        setIsCheckingKit(false);
      }
    };

    checkKitSubscriber();
  }, [userDetails.email]);

  const processPayment = async (
    paymentId: string,
    method: "card" | "paypal" | "free",
  ) => {
    const endpoint =
      method === "free"
        ? "/api/process-free-checkout"
        : "/api/sb-insert-unconfirmed-purchase";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Body data used for both free and paid purchases
          // NOTE snake_case
          ...(method !== "free" && { payment_intent_id: paymentId }),
          t: getTrackerFromStore(),
          coupon_code: getCouponCodeFromStore(),
          basket_items: basketItems,
          user: {
            ...userDetails,
            kit_subscriber_id: kitSubscriberId,
            subscribed_to_marketing: receiveUpdates,
          },
        }),
      });

      if (!response.ok) {
        throw new Error((await response.json()).message);
      }

      // Success - store basket items in session and redirect to checkout-complete page
      sessionStorage.setItem(paymentId, JSON.stringify(basketItems));
      window.location.href = `${window.location.origin}/checkout-complete?checkout_id=${paymentId}&redirect_status=succeeded`;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Payment failed");
      return false;
    }
    return true;
  };

  const handleFreeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const checkoutId = `free_${Date.now()}_${btoa(userDetails.email).substring(0, 8)}`;
    await processPayment(checkoutId, "free");
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isBasketFree(basketItems)) {
      await handleFreeSubmit(e);
      return;
    }

    // Paid submit

    if (!stripe || !elements) {
      setMessage("Stripe has not been initialized");
      return;
    }

    setIsLoading(true);

    // Clear any existing errors
    setCardNumberError(null);
    setCardExpiryError(null);
    setCardCvcError(null);
    setMessage(null);

    // Validate card element
    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
      setCardNumberError("Card details are required");
      setIsLoading(false);
      return;
    }

    if (!elements.getElement(CardNumberElement)) {
      setCardNumberError("Card number is required");
      return;
    }

    const { paymentIntent, error } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardNumberElement)!,
          billing_details: {
            name: `${userDetails.first_name} ${userDetails.surname}`,
            email: userDetails.email,
          },
        },
      },
    );

    // If payment intent is successful, process the payment
    if (paymentIntent && paymentIntent.status === "succeeded") {
      await processPayment(paymentIntent.id, "card");
    }

    if (error) {
      // Handle specific card errors
      const errorMessage = error.message || "Invalid card details"; // Provide default message
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
      return; // prevent further execution after error
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Payment</h2>
      {!isBasketFree(basketItems) && (
        <div className={paymentStyles.paymentMethodSelector}>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          >
            <option value="card">Pay with Card</option>
            <option value="paypal">Pay with PayPal</option>
          </select>
        </div>
      )}

      {paymentMethod === "card" && (
        <div className={paymentStyles.paymentElement}>
          <div className={paymentStyles.cardElement}>
            <label>Card Number</label>
            <CardNumberElement
              options={{
                style: stripeElementStyle,
              }}
              onChange={(event) => {
                setIsCardNumberComplete(event.complete);
                setCardNumberError(null); // Clear error on change
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
                options={{
                  style: stripeElementStyle,
                }}
                onChange={(event) => {
                  setIsCardExpiryComplete(event.complete);
                  setCardExpiryError(null); // Clear error on change
                }}
              />
              {cardExpiryError && (
                <div className={formStyles.error}>{cardExpiryError}</div>
              )}
            </div>

            <div className={paymentStyles.cardElement}>
              <label>CVC</label>
              <CardCvcElement
                options={{
                  style: stripeElementStyle,
                }}
                onChange={(event) => {
                  setIsCardCvcComplete(event.complete);
                  setCardCvcError(null); // Clear error on change
                }}
              />
              {cardCvcError && (
                <div className={formStyles.error}>{cardCvcError}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'paypal' && (
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={async () => {
            try {
              const response = await fetch('/api/create-paypal-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: basketItems })
              });

              if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create PayPal order');
              }

              const { orderId } = await response.json();
              return orderId;
            } catch (error) {
              setMessage(error instanceof Error ? error.message : 'Failed to create PayPal order');
              throw error;
            }
          }}
          onApprove={async (data, actions) => {
            if (actions.order) {
              try {
                const order = await actions.order.capture();
                if (!order.id) throw new Error('No order ID received');
                const success = await processPayment(order.id, 'paypal');
                if (!success) {
                  setMessage('Failed to process payment');
                }
              } catch (error) {
                setMessage('Failed to complete PayPal payment');
                console.error('PayPal payment error:', error);
              }
            }
          }}
          onError={(err) => {
            setMessage('PayPal payment failed. Please try again.');
            console.error('PayPal Error:', err);
          }}
        />
      )}

      <div className={formStyles.checkbox}>
        <label>
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            required
          />
          <span>
            I agree to the{" "}
            <a
              href="/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
            >
              terms and conditions
            </a>
          </span>
        </label>
      </div>

      {showUpdatesCheckbox && (
        <div className={formStyles.checkbox}>
          <label>
            <input
              type="checkbox"
              checked={receiveUpdates}
              onChange={(e) => setReceiveUpdates(e.target.checked)}
            />
            I would like to receive offers and news from Naomi
          </label>
        </div>
      )}

      {message && <div className={formStyles.error}>{message}</div>}

      <button
        disabled={
          isLoading ||
          !agreedToTerms ||
          (paymentMethod === 'card' && (!stripe || !isPaymentComplete)) ||
          isCheckingKit
        }
        className={paymentStyles.checkoutSubmitButton}
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};
