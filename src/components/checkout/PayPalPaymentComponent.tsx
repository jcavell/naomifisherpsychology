import React, { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import formStyles from "../../styles/components/checkout/form.module.css";
import paymentStyles from "../../styles/components/checkout/payment.module.css";
import type { BasketItem } from "../../types/basket-item..ts";
import type { User } from "../../types/user";
import { getTrackerFromStore } from "../../scripts/tracking/trackerRetrieverAndStorer.ts";
import { getCouponCodeFromStore } from "../../scripts/coupon/couponRetrieverAndStorer.ts";
import { TermsNewsletterSubmitComponent } from "./TermsNewsletterSubmitComponent.tsx";

interface PayPalPaymentComponentProps {
  userDetails: User;
  basketItems: BasketItem[];
  setError: (error: string | null) => void;
  onCancel?: () => void; // Optional cancel callback
}

export const PayPalPaymentComponent: React.FC<PayPalPaymentComponentProps> = ({
                                                                                userDetails,
                                                                                basketItems,
                                                                                setError,
                                                                                onCancel
                                                                              }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paypalOrderData, setPaypalOrderData] = useState<any>(null);
  const [showTermsForm, setShowTermsForm] = useState(false);

  const processPayPalPayment = async (paymentId: string, termsData: any) => {
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
            kit_subscriber_id: termsData?.kitSubscriberId,
            subscribed_to_marketing: termsData?.receiveUpdates || false,
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

  const handleTermsSubmit = async (termsData: any) => {
    if (!paypalOrderData) {
      setMessage("Payment data not found. Please try again.");
      return false;
    }

    const success = await processPayPalPayment(paypalOrderData.id, termsData);
    return success;
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Default behavior: reload page to reset checkout
      window.location.reload();
    }
  };

  // Show terms form after PayPal approval
  if (showTermsForm && paypalOrderData) {
    return (
      <div>
        <h2>Complete Your Order</h2>
        <div style={{
          background: '#f8f9fa',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #e9ecef'
        }}>
          <p style={{ margin: 0, color: '#28a745', fontWeight: '500' }}>
            PayPal payment approved successfully
          </p>
          <p style={{ margin: '8px 0 0 0', color: '#6c757d', fontSize: '14px' }}>
            Please accept the terms to complete your purchase.
          </p>
        </div>
        <TermsNewsletterSubmitComponent
          userDetails={userDetails}
          onSubmit={handleTermsSubmit}
          isLoading={isLoading}
          disabled={false}
          submitText="Complete Order"
        />
        {message && <div className={formStyles.error}>{message}</div>}

        {/* Cancel option even after PayPal approval */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleCancel}
            className={paymentStyles.cancelButton}
            style={{
              background: 'transparent',
              border: '1px solid #ccc',
              padding: '8px 16px',
              borderRadius: '4px',
              color: '#666',
              cursor: 'pointer'
            }}
          >
            Cancel Order
          </button>
        </div>
      </div>
    );
  }

  // Main PayPal payment form
  return (
    <div>
      <h2>PayPal Payment</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Click the PayPal button below to complete your payment securely.
      </p>

      <PayPalScriptProvider
        options={{
          clientId: import.meta.env.PUBLIC_PAYPAL_CLIENT_ID,
          currency: "GBP",
          intent: "capture",
          "disable-funding": "credit,card",
          "data-page-type": "checkout"
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <PayPalButtons
            style={{
              layout: "vertical",
              color: "gold",
              shape: "rect",
              label: "paypal",
              height: 55,
              tagline: false
            }}
            disabled={isLoading}
            createOrder={async () => {
              try {
                setIsLoading(true);
                setMessage(null);

                const response = await fetch("/api/create-paypal-order", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                  },
                  body: JSON.stringify({ items: basketItems }),
                });

                if (!response.ok) {
                  const errorText = await response.text();
                  let errorMessage;
                  try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.error || "Failed to create PayPal order";
                  } catch {
                    errorMessage = `Server error: ${response.status}`;
                  }
                  throw new Error(errorMessage);
                }

                const data = await response.json();
                return data.orderId;

              } catch (error) {
                const errorMsg = error instanceof Error ? error.message : "Failed to create PayPal order";
                setMessage(errorMsg);
                setError(errorMsg);
                throw error;
              } finally {
                setIsLoading(false);
              }
            }}
            onApprove={async (data, actions) => {
              try {
                setIsLoading(true);

                if (actions.order) {
                  const order = await actions.order.capture();

                  if (order.id) {
                    setPaypalOrderData(order);
                    setShowTermsForm(true);
                  } else {
                    throw new Error("No order ID received from PayPal");
                  }
                } else {
                  throw new Error("PayPal order actions not available");
                }
              } catch (error) {
                const errorMsg = "Failed to complete PayPal payment";
                setMessage(errorMsg);
                setError(errorMsg);
              } finally {
                setIsLoading(false);
              }
            }}
            onCancel={() => {
              setMessage("Payment was cancelled. You can try again or choose a different payment method.");
              setIsLoading(false);
            }}
            onError={(err) => {
              // Only show user-relevant errors
              if (!err.toString().includes('CORS') && !err.toString().includes('logger')) {
                const errorMsg = "PayPal payment failed. Please try again.";
                setMessage(errorMsg);
                setError(errorMsg);
              }
              setIsLoading(false);
            }}
          />
        </div>
      </PayPalScriptProvider>

      {/* Cancel/Back option */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          style={{
            background: 'transparent',
            border: '1px solid #ddd',
            padding: '10px 20px',
            borderRadius: '4px',
            color: '#666',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          Choose Different Payment Method
        </button>
      </div>

      {message && <div className={formStyles.error}>{message}</div>}
      {isLoading && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: '#6c757d'
        }}>
          <p>Processing payment...</p>
        </div>
      )}
    </div>
  );
};