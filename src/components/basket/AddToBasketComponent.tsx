import React, { useEffect, useState } from "react";
import { useCart } from "react-use-cart";
import "./overlay.css";
import Basket from "./Basket.tsx";

export type BasketItemType = "webinar" | "course";

export interface BasketItem {
  id: string;
  type: BasketItemType;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

const handleFetchAndAddItem = async (addItem, inCart, id: string) => {
  // Check if the item already exists in the cart
  // alert("Adding to basket...");
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
    const checkoutItem: BasketItem = await response.json(); // Parse the JSON response
    addItem(checkoutItem);
    // alert(`${JSON.stringify(checkoutItem)} added to the cart`);
  } catch (err) {
    console.error("Error fetching item:", err);
    // alert("Failed to fetch item details. Please try again.");
  }
};

const Button: React.FC<BasketItem> = ({
  id,
  type,
  isProcessing,
  setIsProcessing,
}) => {
  const { addItem, inCart, removeItem, items } = useCart();

  // Local state to track cart status
  const [isInCart, setIsInCart] = useState(false);
  const [buttonText, setButtonText] = useState("Add to Basket");
  const [isLoading, setIsLoading] = useState(true); // Prevent flashing
  const [showOverlay, setShowOverlay] = useState(false); // Tracks overlay visibility

  useEffect(() => {
    // Ensure cart status is updated after hydration
    setIsInCart(inCart(id));
    setIsLoading(false); // Cart status initialized
  }, [inCart, id]);

  const handleAddToBasket = async () => {
    setIsProcessing(true); // Disable all buttons
    setButtonText("Adding item to basket.");
    const itemExists = inCart(id);
    if (!itemExists) {
      // only 1 of each item allowed
      await handleFetchAndAddItem(addItem, inCart, id);
      setIsInCart(true); // Update local state after adding
      setButtonText("Add to Basket");
      setShowOverlay(true); // Show the overlay after adding to basket
    }
    setIsProcessing(false); // Re-enable buttons
  };

  const handleRemoveFromBasket = () => {
    removeItem(id);
    setButtonText("Add to Basket");
    setIsInCart(false); // Update local state after removing
    // setShowOverlay(false); // Show the overlay after adding to basket
    setIsProcessing(false); // Ensure buttons are enabled after remove
  };

  const closeOverlay = () => {
    console.log("Closing overlay"); // Debugging log for confirmation
    setShowOverlay(false); // Update the visibility state
  };

  // Prevent flashing by showing nothing until the cart status is loaded
  if (isLoading) {
    return null; // Render nothing while loading
  }

  if (type === "webinar") {
    return (
      <>
        <div className="buy-now">
          {isInCart ? (
            <button
              className="add-to-basket remove"
              onClick={(event) => {
                event.preventDefault();
                handleRemoveFromBasket();
              }}
            >
              <span>Remove &times;</span>
            </button>
          ) : (
            <button
              className="add-to-basket"
              disabled={isProcessing}
              onClick={(event) => {
                event.preventDefault();
                handleAddToBasket();
              }}
            >
              <span>{buttonText}</span>
            </button>
          )}
        </div>
        {/* Overlay Section */}
        {showOverlay && (
          <div
            className="overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeOverlay(); // Invoked when clicking outside overlay-content
              }
            }}
          >
            <div className="overlay-content">
              {/* Add a close button */}
              <button
                className="close-overlay-button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the overlay click handler
                  closeOverlay();
                }}
              >
                &times;
              </button>
              <Basket />
            </div>
          </div>
        )}
      </>
    );
  }
};

const AddToBasketComponent: React.FC<BasketItem> = ({
  id,
  type,
  isProcessing,
  setIsProcessing,
}) => {
  return (
    <Button
      id={id}
      type={type}
      isProcessing={isProcessing}
      setIsProcessing={setIsProcessing}
    />
  );
};

export default AddToBasketComponent;
