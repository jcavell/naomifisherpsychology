import React, { useEffect, useState } from "react";
import type { JSX } from "react";
import styles from "../../styles/components/checkout/complete.module.css";
import { emptyBasket, getBasketItems } from "../../scripts/basket/basket.ts";
import { formatAmount } from "../../scripts/basket/utils.ts";
import type { PurchaseData } from "../../pages/api/sb-get-purchase-from-session-id.ts";
import { trackPurchaseEvent } from "../../scripts/tracking/track-events.ts";
import type { User } from "../../types/user";

const isDev = import.meta.env.DEV;

// Only keeping succeeded and default status since that's all we need now
type PaymentStatus = "succeeded" | "default";

const STATUS_CONTENT_MAP: Record<
  PaymentStatus,
  { text: string; iconColor: string; icon: JSX.Element }
> = {
  succeeded: {
    text: "Success",
    iconColor: "#30B130",
    icon: (
      <svg
        width="16"
        height="14"
        viewBox="0 0 16 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.4695 0.232963C15.8241 0.561287 15.8454 1.1149 15.5171 1.46949L6.14206 11.5945C5.97228 11.7778 5.73221 11.8799 5.48237 11.8748C5.23253 11.8698 4.99677 11.7582 4.83452 11.5681L0.459523 6.44311C0.145767 6.07557 0.18937 5.52327 0.556912 5.20951C0.924454 4.89575 1.47676 4.93936 1.79051 5.3069L5.52658 9.68343L14.233 0.280522C14.5613 -0.0740672 15.1149 -0.0953599 15.4695 0.232963Z"
          fill="white"
        />
      </svg>
    ),
  },
  default: {
    text: "Something went wrong, please try again.",
    iconColor: "#DF1B41",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.25628 1.25628C1.59799 0.914573 2.15201 0.914573 2.49372 1.25628L8 6.76256L13.5063 1.25628C13.848 0.914573 14.402 0.914573 14.7437 1.25628C15.0854 1.59799 15.0854 2.15201 14.7437 2.49372L9.23744 8L14.7437 13.5063C15.0854 13.848 15.0854 14.402 14.7437 14.7437C14.402 15.0854 13.848 15.0854 13.5063 14.7437L8 9.23744L2.49372 14.7437C2.15201 15.0854 1.59799 15.0854 1.25628 14.7437C0.914573 14.402 0.914573 13.848 1.25628 13.5063L6.76256 8L1.25628 2.49372C0.914573 2.15201 0.914573 1.59799 1.25628 1.25628Z"
          fill="white"
        />
      </svg>
    ),
  },
};

const RETRY_DELAYS = [2000, 3000, 5000];

const CheckoutCompleteComponent: React.FC = () => {
  const [status, setStatus] = useState<PaymentStatus>("default");
  const [loading, setLoading] = useState(true);
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchPurchaseData = async () => {

      try {
        // Get purchase data (free or paid) from Supabase
        const response = await fetch("/api/sb-get-purchase-from-session-id", {
          method: "GET",
          credentials: "include", // Include cookies
        });

        if (response.ok) {
          const data: PurchaseData = await response.json();
          setPurchaseData(data);

          // Check if payment is confirmed (it is auto confirmed if free)
          const isPaymentConfirmed = data.payment_confirmed;

          if (isPaymentConfirmed && data.items.length > 0) {

            // Meta tracking
            trackPurchaseEvent(
              data.items,
              data.stripe_payment_id, // could be free
              data.Users as User,
            );

            setStatus("succeeded");
            emptyBasket();
            setLoading(false);
            return;
          }
        }
        // If we get here, either response wasn't OK or payment isn't confirmed
        if (retryCount < RETRY_DELAYS.length) {
          // Schedule next retry
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, RETRY_DELAYS[retryCount]);
        } else {
          // No more retries left
          setStatus("default");
          setLoading(false);
        }

      } catch (error) {
        console.error("Error fetching purchase data:", error);
          setStatus("default");
          setLoading(false);
      }
    };

    // Only run if we're in the browser
    if (typeof window !== "undefined") {
      fetchPurchaseData();
    }
  }, [retryCount]);

  if (loading) {
    return (
      <div id="payment-status" className={styles.loadingStatus}>
        <p>Loading payment status.</p>
      </div>
    );
  }

  const purchasedItems = purchaseData?.items || [];

  return (
    <div className={styles.paymentStatus}>
      <div
        className={styles.statusIcon}
        style={{ backgroundColor: STATUS_CONTENT_MAP[status].iconColor }}
      >
        {STATUS_CONTENT_MAP[status].icon}
      </div>
      <h2 className={styles.heading}>{STATUS_CONTENT_MAP[status].text}</h2>

      {status === "succeeded" && purchasedItems.length > 0 && (
        <div className={styles.detailsTable}>
          <h3 className={styles.heading}>Thank you for your order</h3>
          {purchasedItems.some((item) => item.product_type === "course") && (
            <p>
              Check your email for instructions on how to watch your course.
            </p>
          )}
          {purchasedItems.some((item) => item.product_type === "webinar") && (
            <p>Webinar Zoom links will be sent 2 hours before the start</p>
          )}

          <p>
            If you have any questions, please email{" "}
            <a href="mailto:support@naomifisher.co.uk">
              support@naomifisher.co.uk
            </a>
          </p>

          <h3>Order summary</h3>

          <table className={styles.table}>
            <tbody>
              {purchasedItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className={styles.itemDetails}>
                      <div>
                        <div className={styles.webinarName}>
                          {item.product_name}
                        </div>
                        <div className={styles.variantName}>
                          {item.variant_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>£{formatAmount(item.discountedPriceInPence)}</td>
                </tr>
              ))}
              <tr>
                <td>Total</td>
                <td>
                  £
                  {(
                    purchasedItems.reduce(
                      (acc, item) =>
                        acc + item.discountedPriceInPence * item.quantity,
                      0,
                    ) / 100
                  ).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CheckoutCompleteComponent;
