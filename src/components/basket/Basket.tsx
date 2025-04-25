import React, { useEffect, useState } from "react";
import { useCart } from "react-use-cart";
import styles from "../../styles/components/cart/cart.module.css";
import type { BasketItem } from "../../types/basket-item";

export interface BasketProps {
  showEmptyBasketMessage?: boolean;
  showCheckoutButton?: boolean;
  onItemRemoved?: () => void; // Callback when an item is removed
}

const formatPrice = (amountInPence: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amountInPence / 100); // Divide by 100 because amount is in pence

function removeExpiredItemsFromCart(
  removeItem: (id: string) => void,
  basketItems: BasketItem[],
) {
  const now = new Date();
  const twentyMinutesFromNow = new Date(now.getTime() + 20 * 60 * 1000);

  const expiredItems: BasketItem[] = [];

  basketItems.forEach((item) => {
    const expiresAt = new Date(item.expires_at);

    if (expiresAt < twentyMinutesFromNow) {
      // console.log("Expired, removing from cart:");
      expiredItems.push(item);

      // Remove from cart
      removeItem(item.id);
    }
  });

  return expiredItems;
}

export const Basket: React.FC<BasketProps> = ({
  showEmptyBasketMessage = true,
  showCheckoutButton = true,
  onItemRemoved,
}) => {
  const [isClient, setIsClient] = useState(false);
  const { isEmpty, cartTotal, items, removeItem } = useCart();
  const [expiredCartItems, setExpiredCartItems] = useState<BasketItem[]>([]);
  const [hasJustExpired, setHasJustExpired] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures this component renders only on the client
  }, []);

  // Run expired items check periodically
  useEffect(() => {
    if (!items.length) return;

    // Initial check
    const expiredItems = removeExpiredItemsFromCart(
      removeItem,
      items as BasketItem[],
    );
    if (expiredItems.length > 0) {
      setExpiredCartItems(expiredItems);
      setHasJustExpired(true);
    }

    // Set up interval to check every minute
    const interval = setInterval(() => {
      const expiredItems = removeExpiredItemsFromCart(
        removeItem,
        items as BasketItem[],
      );
      if (expiredItems.length > 0) {
        setExpiredCartItems(expiredItems);
        setHasJustExpired(true);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [items, removeItem]);

  if (!isClient) {
    return null; // Return nothing during SSR to prevent mismatched HTML
  }

  const handleRemoveItem = (id: string) => {
    removeItem(id); // Call the cart removal logic
    if (onItemRemoved) {
      onItemRemoved(); // Notify the parent component
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return alert("No items in basket");
    window.location.href = "/checkout";
  };

  // Show either expired items or empty basket message
  if (isEmpty) {
    return (
      <div className={styles.cartContainer}>
        {hasJustExpired && expiredCartItems.length > 0 ? (
          <div className={styles.expiredMessage}>
            <h2>Items Removed (Expired)</h2>
            {expiredCartItems.map((item) => (
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
      <h1 className={styles.cartTitle}>Order Summary</h1>

      {/* Render the cart items */}
      <ul className={styles.cartItems}>
        {items.map((item) => {
          // const checkoutItem = item as CheckoutItem; // Cast item to CheckoutItem
          return (
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
              <span
                className={`${styles.itemColumn} ${styles.price}`}
              >
                {formatPrice(item.price)}
              </span>
              <button
                className={styles.removeButton}
                onClick={() => handleRemoveItem(item.id)}
              >
                Remove &times;
              </button>
            </li>
          );
        })}
      </ul>

      <div className={styles.cartSummary}>
        Total: <strong>{formatPrice(cartTotal)}</strong>
      </div>

      {showCheckoutButton && items.length > 0 && (
        <div className={styles.cartActions}>
          <button className={styles.checkoutButton} onClick={handleCheckout}>
            Checkout
          </button>
          {/*<button className={styles.emptyButton} onClick={emptyCart}>*/}
          {/*  Empty Basket*/}
          {/*</button>*/}
        </div>
      )}
    </div>
  );
};

export default Basket;
