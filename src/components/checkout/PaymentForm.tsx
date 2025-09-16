import React, { useEffect, useState } from "react";
import {
  PaymentElement,
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
  paymentIntentId: string;
  userDetails: User;
  basketItems: BasketItem[];
}

export const PaymentForm: React.FC<CheckoutFormProps> = ({ paymentIntentId, userDetails, basketItems }) => {

  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentElementComplete, setPaymentElementComplete] = useState<boolean>(false);

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [receiveUpdates, setReceiveUpdates] = useState(false);
  const [showUpdatesCheckbox, setShowUpdatesCheckbox] = useState(false);
  const [kitSubscriberId, setKitSubscriberId] = useState<string | null>(null);
  const [isCheckingKit, setIsCheckingKit] = useState(false);

  const isBasketFree = (items: BasketItem[]): boolean => {
    return items.every((item) => item.discountedPriceInPence === 0);
  };

  useEffect(() => {
    const checkKitSubscriber = async () => {
      setIsCheckingKit(true);
      try {
        const res = await fetch(`/api/get-kit-user?email=${encodeURIComponent(userDetails.email)}`);
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
    t:getTrackerFromStore(),
    coupon_code:getCouponCodeFromStore(),
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

      // TODO insert purchases into unconfirmed purchase equivalent!
      window.location.href = `${window.location.origin}/checkout-complete?checkout_id=${checkoutId}`;

    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "An error occurred processing your free items."
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

    if (!stripe || !elements) return;
    setIsLoading(true);

    try {
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
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${origin}/confirm-purchase?payment_intent_id=${paymentIntentId}`,
          payment_method_data: {
            billing_details: {
              name: `${userDetails.first_name} ${userDetails.surname}`,
              email: userDetails.email,
            },
          },
        },
      });

      if (error) {
        setMessage(error.message ?? "An unexpected error occurred");      }
    } catch (error) {
      setMessage("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Payment</h2>
      <div className={paymentStyles.paymentElement}>
        <PaymentElement
          onChange={(event) => setPaymentElementComplete(event.complete)}
        />
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
            <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">
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
          !paymentElementComplete ||
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