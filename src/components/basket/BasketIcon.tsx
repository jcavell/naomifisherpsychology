import React from 'react';
import { CartProvider, useCart } from "react-use-cart";
import styles from "../../styles/components/cart/basketIcon.module.css";

const BasketIconContent: React.FC = () => {
  const { totalItems } = useCart();

  return (
    <a href="/basket" className={`basket-button ${styles.basketWrapper}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      {totalItems > 0 && (
        <span className={styles.basketCount}>
          {totalItems}
        </span>
      )}
    </a>
  );
};

const BasketIcon: React.FC = () => {
  return (
    <CartProvider id="website">
      <BasketIconContent />
    </CartProvider>
  );
};

export default BasketIcon;