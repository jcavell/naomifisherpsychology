import React, { useEffect, useState } from "react";
import { useCart } from "react-use-cart";
import styles from "../../styles/components/cart/overlay.module.css";
import cartStyles from "../../styles/components/cart/cart.module.css";
export type BasketItemType = "webinar" | "course";

export interface BasketItem {
  id: string;
  type: BasketItemType;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
  buttonType?: "summary" | "detail";
}

const handleFetchAndAddItem = async (
  addItem,
  inCart,
  id: string,
  type: BasketItemType,
) => {
  // Check if the item already exists in the cart
  if (inCart(id)) {
    return;
  }

  try {
    const endpoint =
      type === "course" ? `/api/courses/${id}` : `/api/webinar-tickets/${id}`;

    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const basketItem: BasketItem = await response.json();
    addItem(basketItem);
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
  buttonType,
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
      await handleFetchAndAddItem(addItem, inCart, id, type);
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
    setShowOverlay(false); // Update the visibility state
  };

  // Prevent flashing by showing nothing until the cart status is loaded
  if (isLoading) {
    return null; // Render nothing while loading
  }

  return (
    <>
      {isInCart ? (
        <button
          className={
            buttonType === "detail"
              ? `${styles.addToBasket} ${styles.inBasket}`
              : `add-to-basket-from-summary ${styles.textButton}`
          }
          onClick={(event) => {
            event.preventDefault();
            window.location.href = "/basket";
          }}
        >
          <span>In Basket</span>
        </button>
      ) : (
        <button
          className={
            buttonType === "detail"
              ? styles.addToBasket
              : `add-to-basket-from-summary ${styles.textButton}`
          }
          disabled={isProcessing}
          onClick={(event) => {
            event.preventDefault();
            handleAddToBasket();
          }}
        >
          {buttonText}
        </button>
      )}

      {/* Overlay Section */}
      {showOverlay && (
        <div
          className={styles.overlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeOverlay(); // Invoked when clicking outside overlay-content
            }
          }}
        >
          <div className={styles.overlayContent}>
            {/* Add a close button */}
            <div
              className={styles.closeOverlayButton}
              onClick={(e) => {
                e.stopPropagation(); // Prevent the overlay click handler
                closeOverlay();
              }}
            >
              &times;
            </div>
            <h3>ADDED TO BASKET</h3>
            <p>
              {items.find((item) => item.id === id)?.product_name}
            </p>
            <button
              className={cartStyles.checkoutButton}
              onClick={() => (window.location.href = "/checkout")}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const AddToBasketComponent: React.FC<BasketItem> = ({
  id,
  type,
  isProcessing,
  setIsProcessing,
  buttonType = "detail",
}) => {
  return (
    <Button
      id={id}
      type={type}
      isProcessing={isProcessing}
      setIsProcessing={setIsProcessing}
      buttonType={buttonType}
    />
  );
};

export default AddToBasketComponent;
