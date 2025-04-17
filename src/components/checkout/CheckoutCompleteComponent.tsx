import React, { useEffect, useState } from "react";
import type { JSX } from "react";
import styles from "../../styles/components/checkout/complete.module.css";
import { useCart } from "react-use-cart";
import type { BasketItem } from "../../types/basket-item";

const isDev = import.meta.env.DEV;

// Only keeping succeeded and default status since that's all we need now
type PaymentStatus = "succeeded" | "default";

const STATUS_CONTENT_MAP: Record<
  PaymentStatus,
  { text: string; iconColor: string; icon: JSX.Element }
> = {
  succeeded: {
    text: "Purchase Success",
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

const CheckoutCompleteComponent: React.FC = () => {
  const { emptyCart } = useCart();
  const [status, setStatus] = useState<PaymentStatus>("default");
  const [loading, setLoading] = useState(true); // Add loading state back
  const [purchasedItems, setPurchasedItems] = useState<BasketItem[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkoutId = params.get("checkout_id");
    const redirectStatus = params.get("redirect_status");

    if (!checkoutId) {
      setStatus("default");
      return;
    }

    const storedItems = JSON.parse(sessionStorage.getItem(checkoutId) || "[]");
    setPurchasedItems(storedItems);

    // If it's a paid transaction, check redirect_status
    // If it's a free transaction (starts with 'free_') or paid with success, set succeeded
    if (checkoutId.startsWith("free_") || redirectStatus === "succeeded") {
      setStatus("succeeded");
      emptyCart();
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div id="payment-status" className={styles.loadingStatus}>
        <p>Loading payment status.</p>
      </div>
    );
  }

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
          <h3 className={styles.heading}>
            Thank you for your purchase with Naomi Fisher Psychology
          </h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {purchasedItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className={styles.itemDetails}>
                      {item.product_images?.[0] && (
                        <img
                          src={item.product_images[0]}
                          alt={item.product_name}
                          className={styles.productImage}
                        />
                      )}
                      <div>
                        <div className={styles.webinarName}>
                          {item.product_name}
                        </div>
                        <div className={styles.variantName}>
                          {item.variant_name}
                        </div>
                        {item.product_type === "webinar" && (
                          <div className={styles.zoomInfo}>
                            Zoom link will be sent 2 hours before the start
                          </div>
                        )}
                        {item.product_type === "course" && (
                          <div className={styles.zoomInfo}>
                            Check your email for instructions on how to watch
                            this course. It is available to watch for 12 months.
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>£{(item.price / 100).toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td>Total</td>
                <td>
                  £
                  {(
                    purchasedItems.reduce(
                      (acc, item) => acc + item.price * item.quantity,
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
