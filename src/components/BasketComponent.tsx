import React, { useEffect, useState } from "react";
import { CartProvider, useCart } from "react-use-cart";
import styles from "./Cart.module.css"; // Modular CSS for styles

export interface BasketProps {
  showActions?: boolean;
}

const formatPrice = (amountInPence: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amountInPence / 100); // Divide by 100 because amount is in pence

export const Basket: React.FC<BasketProps> = ({ showActions = true }) => {
  const { isEmpty, cartTotal, items, removeItem, emptyCart } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return alert("No items in basket");
    window.location.href = "/checkout";
  };

  if (isEmpty) return <p className={styles.emptyCart}>Your basket is empty</p>;

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.cartTitle}>Your Basket</h1>

      {/* Add column headings */}
      <div className={styles.cartHeadings}>
        <span>Webinar</span>
        <span>Ticket</span>
        <span>Price</span>
      </div>

      {/* Render the cart items */}
      <ul className={styles.cartItems}>
        {items.map((item) => {
          // const checkoutItem = item as CheckoutItem; // Cast item to CheckoutItem
          return (
            <li key={item.id} className={styles.cartItem}>
              <span className={styles.itemColumn}>{item.product_name}</span>
              <span className={styles.itemColumn}>{item.variant_name}</span>
              <span className={styles.itemColumn}>
                {formatPrice(item.price)}
              </span>
              <button
                className={styles.removeButton}
                onClick={() => removeItem(item.id)}
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
          <button className={styles.emptyButton} onClick={emptyCart}>
            Empty Basket
          </button>
        </div>
      )}
    </div>
  );
};

const BasketComponent: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures this component renders only on the client
  }, []);

  if (!isClient) {
    return null; // Return nothing during SSR to prevent mismatched HTML
  }

  return (
    <CartProvider id="website">
      <Basket />
    </CartProvider>
  );
};

export default BasketComponent;
