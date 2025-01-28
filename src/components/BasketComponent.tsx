import React from "react";
import { CartProvider, useCart } from "react-use-cart";
import type { CheckoutItem } from "../types/checkoutItem";
import styles from "./Cart.module.css"; // Modular CSS for styles

const Cart: React.FC = () => {
  const { isEmpty, cartTotal, items, removeItem, emptyCart } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return alert("No items in basket");
    window.location.href = "/checkout";
  };

  if (isEmpty) return <p className={styles.emptyCart}>Your basket is empty</p>;

  const formattedPrice = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(cartTotal / 100); // Divide by 100 because cartTotal is in pence

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.cartTitle}>Your Basket</h1>
      <div className={styles.cartSummary}>
        Total: <strong>{formattedPrice}</strong>
      </div>

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
              <span className={styles.itemColumn}>{formattedPrice}</span>
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

      <div className={styles.cartActions}>
        <button className={styles.checkoutButton} onClick={handleCheckout}>
          Checkout
        </button>
        <button className={styles.emptyButton} onClick={emptyCart}>
          Empty Basket
        </button>
      </div>
    </div>
  );
};

const BasketComponent: React.FC = () => {
  return (
    <CartProvider id="website">
      <Cart />
    </CartProvider>
  );
};

export default BasketComponent;
