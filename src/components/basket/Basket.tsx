import React, { useEffect, useState } from "react";
import { useCart } from "react-use-cart";
import styles from "./Cart.module.css"; // Modular CSS for styles

export interface BasketProps {
  showActions?: boolean;
  onItemRemoved?: () => void; // Callback when an item is removed
}

const formatPrice = (amountInPence: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amountInPence / 100); // Divide by 100 because amount is in pence

export const Basket: React.FC<BasketProps> = ({
  showActions = true,
  onItemRemoved,
}) => {
  const [isClient, setIsClient] = useState(false);
  const { isEmpty, cartTotal, items, removeItem, emptyCart } = useCart();

  useEffect(() => {
    setIsClient(true); // Ensures this component renders only on the client
  }, []);

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

  if (isEmpty) return <p className={styles.emptyCart}></p>;

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
                className={styles.itemColumn}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                {item.product_images?.length > 0 && (
                  <img
                    src={item.product_images[0]}
                    alt={item.product_name}
                    style={{
                      width: "50px",
                      height: "auto",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                )}
                {item.product_name} ({item.variant_name} ticket)
              </span>
              <span className={styles.itemColumn}>
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

      {showActions && (
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
