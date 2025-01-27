import React, { useEffect, useState } from "react";
import { CartProvider, useCart } from "react-use-cart";
import type { CheckoutItem } from "../types/checkoutItem";

export type BasketItemType = "webinar" | "course";

export interface BasketItem {
  id: string;
  type: BasketItemType;
}

const handleFetchAndAddItem = async (addItem, inCart, id: string) => {
  // Check if the item already exists in the cart
  alert("Adding to basket...");
  if (inCart(id)) {
    // alert("This item is already in the cart.");
    return;
  }

  // Get the CheckoutItem data from the id
  try {
    const response = await fetch(`/api/webinar-tickets/${id}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    // Add CheckoutItem to basket
    const checkoutItem: CheckoutItem = await response.json(); // Parse the JSON response
    addItem(checkoutItem);
    alert(`${JSON.stringify(checkoutItem)} added to the cart`);
  } catch (err) {
    // console.error("Error fetching item:", err);
    // alert("Failed to fetch item details. Please try again.");
  }
};

const Button: React.FC<BasketItem> = ({ id, type }) => {
  const { addItem, inCart, removeItem } = useCart();

  // Local state to track cart status
  const [isInCart, setIsInCart] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Prevent flashing

  useEffect(() => {
    // Ensure cart status is updated after hydration
    setIsInCart(inCart(id));
    setIsLoading(false); // Cart status initialized
  }, [inCart, id]);

  const handleAddToBasket = async () => {
    const itemExists = inCart(id);
    if (!itemExists) {
      await handleFetchAndAddItem(addItem, inCart, id);
      setIsInCart(true); // Update local state after adding
    }
  };

  const handleRemoveFromBasket = () => {
    removeItem(id);
    setIsInCart(false); // Update local state after removing
  };

  // Prevent flashing by showing nothing until the cart status is loaded
  if (isLoading) {
    return null; // Render nothing while loading
  }

  if (type === "webinar") {
    return (
      <div className="buy-now">
        {isInCart ? (
          <button
            onClick={(event) => {
              event.preventDefault();
              handleRemoveFromBasket();
            }}
          >
            <span>Remove &times;</span>
          </button>
        ) : (
          <button
            onClick={(event) => {
              event.preventDefault();
              handleAddToBasket();
            }}
          >
            <span>Add to Basket</span>
          </button>
        )}
      </div>
    );
  }
};

const AddToBasketComponent: React.FC<BasketItem> = ({ id, type }) => {
  return <Button id={id} type={type} />;
};

export default AddToBasketComponent;
