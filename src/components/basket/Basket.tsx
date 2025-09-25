import React, { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import {
  removeItem,
  getItemCount,
  getTotalPrice,
  getIsEmpty,
  getBasketItems,
  refreshBasketItems,
} from "../../scripts/basket/basket.ts";
import styles from "../../styles/components/cart/cart.module.css";
import type { BasketItem } from "../../types/basket-item.ts";
import { removeCouponCodeFromStore } from "../../scripts/coupon/couponRetrieverAndStorer.ts";
import { persistentCoupon } from "../../scripts/coupon/couponStore.ts";
import { isCouponCodeValid } from "../../scripts/coupon/coupons.ts";
import { trackAddToBasketEvent } from "../../scripts/tracking/track-events.ts";

export interface BasketProps {
  showEmptyBasketMessage?: boolean;
  onItemRemoved?: () => void; // Callback when an item is removed
  basketTitle?: string;
  isCheckoutPage?: boolean; //  Flag to indicate if we're on checkout page
}

const formatPrice = (amountInPence: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amountInPence / 100); // Divide by 100 because amount is in pence

function removeExpiredItemsFromCart(
  basketItems: BasketItem[]
) {
  const now = new Date();
  const twentyMinutesFromNow = new Date(now.getTime() + 20 * 60 * 1000);

  return basketItems.filter(item => {
    const expiresAt = new Date(item.expires_at);
    const isExpired = expiresAt < twentyMinutesFromNow;
    if (isExpired) {
      removeItem(item.id); // Directly use Nano Store's removeItem
    }
    return isExpired;
  });
}

export const Basket: React.FC<BasketProps> = ({
  showEmptyBasketMessage = true,
  onItemRemoved,
  basketTitle = "Basket",
  isCheckoutPage = false,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [expiredBasketItems, setExpiredBasketItems] = useState<BasketItem[]>([]);
  const [hasJustExpired, setHasJustExpired] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string>('');


  const $basketItems = useStore(getBasketItems);
  const $isEmpty = useStore(getIsEmpty);
  const $total = useStore(getTotalPrice);
  const $count = useStore(getItemCount);
  const $couponCode = useStore(persistentCoupon);

  // ALSO ADD this useEffect to prevent the coupon value from going back into the input:
  useEffect(() => {
    // Don't sync the coupon store value back to the input
    // The input should only be controlled by user typing
    const currentCoupon = persistentCoupon.get();
    if (!currentCoupon) {
      // Only clear if there's no applied coupon and input has content
      if (couponCode && !hasAppliedCoupon()) {
        setCouponCode('');
      }
    }
  }, [persistentCoupon.get()]); // Listen to coupon store changes

  useEffect(() => {
    setIsClient(true); // Ensures this component renders only on the client
  }, []);

  // Run expired items check periodically
  useEffect(() => {
    if ($count === 0) return;

    const expiredItems = removeExpiredItemsFromCart($basketItems);

    if (expiredItems.length > 0) {
      setExpiredBasketItems(expiredItems);
      setHasJustExpired(true);
    }

    const interval = setInterval(() => {
      const newExpiredItems = removeExpiredItemsFromCart($basketItems);
      if (newExpiredItems.length > 0) {
        setExpiredBasketItems(newExpiredItems);
        setHasJustExpired(true);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [$basketItems, $count]);

  useEffect(() => {
    if (!isClient) return;

    const unsubscribe = persistentCoupon.listen((newValue, oldValue) => {
      if (newValue !== oldValue && newValue) {
        refreshBasketItems();
      }
    });

    // Clean up both the listener and any pending refreshBasketItems calls
    return () => {
      unsubscribe();
      refreshBasketItems.cancel();
    };
  }, [isClient]); // Only run when client-side

  if (!isClient) {
    return null; // Return nothing during SSR to prevent mismatched HTML
  }

  const hasAppliedCoupon = () => {
    return $basketItems.some(
      item => item.originalPriceInPence !== item.discountedPriceInPence
    );
  };

  // MINIMAL CHANGES - Replace these two functions in your existing code:

  const handleApplyCoupon = () => {
    const trimmedCode = couponCode.trim();

    // Clear any previous error
    setCouponError('');

    // Validate input
    if (!trimmedCode) {
      setCouponError('Please enter a coupon code');
      return;
    }

    // Validate coupon code
    if (!isCouponCodeValid(trimmedCode)) {
      setCouponError('Coupon not valid');
      return;
    }

    try {
      // Apply the coupon
      persistentCoupon.set(trimmedCode);

      // Clear the input immediately (don't wait for validation)
      setCouponCode('');

      // The basket will refresh automatically via the useEffect listener
      // Don't validate here - let the UI update naturally

    } catch (error) {
      console.error('Failed to apply coupon:', error);
      setCouponError('Failed to apply coupon. Please try again.');
    }
  };

  const handleRemoveCoupon = () => {
    // Clear everything first
    setCouponError('');
    setCouponCode('');

    // Cancel any pending refresh operations
    refreshBasketItems.cancel();

    // Then remove from store
    removeCouponCodeFromStore();
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id); // Call the cart removal logic
    if (onItemRemoved) {
      onItemRemoved(); // Notify the parent component
    }
  };

  const handleCheckout = () => {
    if ($count === 0) return alert("No items in basket");
    window.location.href = "/checkout";
  };

  // Show either expired items or empty basket message
  if ($isEmpty) {
    return (
      <div className={styles.cartContainer}>
        {hasJustExpired && expiredBasketItems.length > 0 ? (
          <div className={styles.expiredMessage}>
            <h2>Items Removed (Expired)</h2>
            {expiredBasketItems.map((item) => (
              <div key={item.id} className={styles.expiredItem}>
                <h3>{item.product_name}</h3>
                <p>Expired at: {new Date(item.expires_at).toLocaleString()}</p>
              </div>
            ))}
            {showEmptyBasketMessage && (
              <p className={styles.emptyCart}>Your basket is now empty.</p>
            )}
          </div>
        ) : (
          showEmptyBasketMessage && (
            <p className={styles.emptyCart}>Your basket is empty.</p>
          )
        )}
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.cartTitle}>{basketTitle}</h1>

      <div className={styles.couponSection}>
        {hasAppliedCoupon() ? (
          <div className={styles.appliedCoupon}>
            <span>
              Coupon {$basketItems.find((item) => item.couponCode)?.couponCode}{" "}
              applied
            </span>
            <button
              className={styles.removeCouponButton}
              onClick={handleRemoveCoupon}
              aria-label="Remove coupon"
            >
              ×
            </button>
          </div>
        ) : (
          <div className={styles.couponInput}>
            <div className={styles.couponInputRow}>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className={styles.couponCodeInput}
              />
              <button
                className={styles.applyCouponButton}
                onClick={handleApplyCoupon}
                disabled={!couponCode.trim()}
              >
                Apply
              </button>
            </div>
            {couponError && (
              <div className={styles.couponError}>{couponError}</div>
            )}
          </div>
        )}
      </div>

      <ul className={styles.cartItems}>
        {$basketItems.map((item) => (
          <li key={item.id} className={styles.cartItem}>
              <span
                className={`${styles.itemColumn} ${styles.nameAndDescription}`}
              >
                {" "}
                <div className={styles.productContainer}>
                  {item.product_images?.length > 0 && (
                    <img
                      src={item.product_images[0]}
                      alt={item.product_name}
                      className={styles.productImage}
                    />
                  )}
                  <div className={styles.productInfo}>
                    <span>{item.product_name}</span>
                    <span className={styles.variantName}>
                      {item.variant_name}
                    </span>
                  </div>
                </div>
              </span>
            <span className={`${styles.itemColumn} ${styles.price}`}>
                {item.originalPriceInPence !== item.discountedPriceInPence && (
                  <span className={styles.originalPrice}>
                    {formatPrice(item.originalPriceInPence)}
                  </span>
                )}
              {formatPrice(item.discountedPriceInPence)}
              </span>
            <button
              className={styles.removeButton}
              onClick={() => handleRemoveItem(item.id)}
            >
              Remove &times;
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.cartSummary}>
        Total: <strong>{formatPrice($total)}</strong>
      </div>

      {!isCheckoutPage && !$isEmpty && (
        <div className={styles.cartActions}>
          <button className={styles.checkoutButton} onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Basket;