import React, { useEffect, useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import formStyles from "../../styles/components/checkout/form.module.css";
import paymentStyles from "../../styles/components/checkout/payment.module.css";
import type { BasketItem } from "../../types/basket-item..ts";
import type { User } from "../../types/user";
import { getTrackerFromStore } from "../../scripts/tracking/trackerRetrieverAndStorer.ts";
import { getCouponCodeFromStore } from "../../scripts/coupon/couponRetrieverAndStorer.ts";

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

  // Body data used for both free and paid purchases
  // NOTE snake_case
  const getInsertPurchaseBodyData = () => ({
    t: getTrackerFromStore(),
    coupon_code: getCouponCodeFromStore(),
    basket_items: basketItems,
    user: {
      ...userDetails,
      kit_subscriber_id: kitSubscriberId,
      subscribed_to_marketing: receiveUpdates,
    },
  });

  const handleFreeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const response = await fetch("/api/process-free-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getInsertPurchaseBodyData()),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      const checkoutId = `free_${Date.now()}_${btoa(userDetails.email).substring(0, 8)}`;
      sessionStorage.setItem(checkoutId, JSON.stringify(basketItems));
      window.location.href = `${window.location.origin}/checkout-complete?checkout_id=${checkoutId}`;
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "An error occurred processing your free items.",
      );
    } finally {
      setIsLoading(false);
    }
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
    const paymentIntentId = clientSecret.split("_secret")[0];

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

    // Step 1: Store user and unconfirmed payment details in Supabase
    // Add payment_intent_id to body
    const response = await fetch("/api/sb-insert-unconfirmed-purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payment_intent_id: paymentIntentId,
        ...getInsertPurchaseBodyData(),
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      setMessage(data.message);
    }

    // Step 2: Confirm payment using Stripe
    // Store items in sessionStorage before payment confirmation
    sessionStorage.setItem(`${paymentIntentId}`, JSON.stringify(basketItems));

    if (!elements.getElement(CardNumberElement)) {
      setCardNumberError("Card number is required");
      return;
    }

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement)!,
        billing_details: {
          name: `${userDetails.first_name} ${userDetails.surname}`,
          email: userDetails.email,
        },
      },
    });

    // If payment successful, handle redirect manually
    if (paymentIntent && paymentIntent.status === 'succeeded') {
      window.location.href = `${origin}/checkout-complete?checkout_id=${paymentIntent.id}&redirect_status=succeeded`;
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
          !stripe ||
          isLoading ||
          !isPaymentComplete ||
          !agreedToTerms ||
          isCheckingKit
        }
        className={paymentStyles.checkoutSubmitButton}
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};
