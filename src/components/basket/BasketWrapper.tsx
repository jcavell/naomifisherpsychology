import React from "react";
import { CartProvider } from "react-use-cart";
import Basket from "./Basket.tsx";

// Wrapper component
const BasketWrapper: React.FC = () => {
  return (
    <CartProvider id="website">
      <Basket />
    </CartProvider>
  );
};

export default BasketWrapper;
