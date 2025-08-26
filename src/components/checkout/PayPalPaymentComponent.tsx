import React, { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import formStyles from "../../styles/components/checkout/form.module.css";
import type { BasketItem } from "../../types/basket-item..ts";
import type { User } from "../../types/user";
import { getTrackerFromStore } from "../../scripts/tracking/trackerRetrieverAndStorer.ts";
import { getCouponCodeFromStore } from "../../scripts/coupon/couponRetrieverAndStorer.ts";
import { TermsNewsletterSubmitComponent } from "./TermsNewsletterSubmitComponent.tsx";

interface PayPalPaymentComponentProps {
  userDetails: User;
  basketItems: BasketItem[];
  setError: (error: string | null) => void;
}

export const PayPalPaymentComponent: React.FC<PayPalPaymentComponentProps> = ({
  userDetails,
  basketItems,
  setError,
}) => {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const processPayPalPayment = async (paymentId: string) => {
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
            kit_subscriber_id: formData?.kitSubscriberId,
            subscribed_to_marketing: formData?.receiveUpdates || false,
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

  const handleTermsSubmit = (data: any) => {
    setFormData(data);
    setTermsAccepted(true);
    return true; // Don't process payment yet, just accept terms
  };

  if (!termsAccepted) {
    return (
      <div>
        <h2>PayPal Payment</h2>
        <p style={{ marginBottom: "20px", color: "#666" }}>
          Please accept the terms and conditions to continue with PayPal
          payment.
        </p>
        <TermsNewsletterSubmitComponent
          userDetails={userDetails}
          onSubmit={handleTermsSubmit}
          isLoading={false}
          disabled={false}
          submitText="Continue to PayPal"
        />
      </div>
    );
  }

  return (
    <div>
      <h2>PayPal Payment</h2>

      <PayPalScriptProvider
        options={{
          clientId: import.meta.env.PUBLIC_PAYPAL_CLIENT_ID,
          currency: "GBP",
        }}
      >
        <PayPalButtons
          style={{ layout: "vertical" }}
          disabled={isLoading}
          createOrder={async () => {
            try {
              setIsLoading(true);
              const response = await fetch("/api/create-paypal-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: basketItems }),
              });

              if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to create PayPal order");
              }

              const { orderId } = await response.json();
              return orderId;
            } catch (error) {
              const errorMsg =
                error instanceof Error
                  ? error.message
                  : "Failed to create PayPal order";
              setMessage(errorMsg);
              setError(errorMsg);
              throw error;
            } finally {
              setIsLoading(false);
            }
          }}
          onApprove={async (data, actions) => {
            if (actions.order) {
              try {
                setIsLoading(true);
                const order = await actions.order.capture();
                if (!order.id) throw new Error("No order ID received");

                const success = await processPayPalPayment(order.id);
                if (!success) {
                  const errorMsg = "Failed to process payment";
                  setMessage(errorMsg);
                  setError(errorMsg);
                }
              } catch (error) {
                const errorMsg = "Failed to complete PayPal payment";
                setMessage(errorMsg);
                setError(errorMsg);
                console.error("PayPal payment error:", error);
              } finally {
                setIsLoading(false);
              }
            }
          }}
          onError={(err) => {
            const errorMsg = "PayPal payment failed. Please try again.";
            setMessage(errorMsg);
            setError(errorMsg);
            console.error("PayPal Error:", err);
            setIsLoading(false);
          }}
        />
      </PayPalScriptProvider>

      {message && <div className={formStyles.error}>{message}</div>}
      {isLoading && <p>Processing payment...</p>}
    </div>
  );
};
