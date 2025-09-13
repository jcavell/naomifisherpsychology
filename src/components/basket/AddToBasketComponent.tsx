import React, { useState } from "react";
import { useStore } from "@nanostores/react";
import {
  addItem,
  removeItem,
  getBasketItem,
} from "../../scripts/basket/basket.ts";
import overlayStyles from "../../styles/components/cart/overlay.module.css";
import cartStyles from "../../styles/components/cart/cart.module.css";
import { useClientOnly } from "../../scripts/basket/use-client-only-hook.ts";
import { clientFetchItemFromAPI } from "../../scripts/basket/getCourseOrWebinarFromAPI.ts";

export type BasketItemType = "webinar" | "course";

export interface AddToBasketProps {
  id: string;
  type: BasketItemType;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
  buttonType?: "summary" | "detail";
}

const Button: React.FC<AddToBasketProps> = ({
  id,
  type,
  isProcessing,
  setIsProcessing,
  buttonType,
}) => {
  const isClient = useClientOnly(); // Hook to check client-side
  const $basketItem = useStore(getBasketItem(id));

  const [buttonText, setButtonText] = useState("Add to Basket");
  const [showOverlay, setShowOverlay] = useState(false); // Tracks overlay visibility

  if (!isClient) {
    // Return minimal SSR-compatible markup
    return <button className={overlayStyles.addToBasket}>Loading...</button>;
  }

  const handleAddToBasket = async () => {
    setIsProcessing(true);
    setButtonText("Adding...");

    if (!$basketItem) {
      try {
        const basketItem = await clientFetchItemFromAPI(id, type);
        if (basketItem !== undefined) {
          addItem(basketItem);
        }
        setShowOverlay(true);
      } finally {
        setIsProcessing(false);
        setButtonText("Add to Basket");
      }
    } else {
      setIsProcessing(false);
    }
  };

  const handleRemoveFromBasket = () => {
    removeItem(id);
    setButtonText("Add to Basket");
    setIsProcessing(false);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
  };

  return (
    <>
      {$basketItem ? (
        <button
          className={
            buttonType === "detail"
              ? `${overlayStyles.addToBasket} ${overlayStyles.inBasket}`
              : `add-to-basket-from-summary ${overlayStyles.textButton}`
          }
          onClick={(event) => {
            event.preventDefault();
            window.location.href = "/basket";
          }}
          style={{
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <span>In Basket</span>
        </button>
      ) : (
        <button
          className={
            buttonType === "detail"
              ? overlayStyles.addToBasket
              : `add-to-basket-from-summary ${overlayStyles.textButton}`
          }
          disabled={isProcessing}
          onClick={(event) => {
            event.preventDefault();
            handleAddToBasket();
          }}
          style={{
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {buttonText}
        </button>
      )}

      {showOverlay && (
        <div
          className={overlayStyles.overlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeOverlay(); // Invoked when clicking outside overlay-content
            }
          }}
        >
          <div className={overlayStyles.overlayContent}>
            <div
              className={overlayStyles.closeOverlayButton}
              onClick={(e) => {
                e.stopPropagation(); // Prevent the overlay click handler
                closeOverlay();
              }}
            >
              &times;
            </div>
            <h3>ADDED TO BASKET</h3>
            <p>{$basketItem?.product_name}</p>
            <div className={overlayStyles.buttonGroup}>
              <button
                className={overlayStyles.continueButton}
                onClick={closeOverlay}
              >
                Continue Shopping
              </button>
              <button
                className={cartStyles.checkoutButton}
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.location.href = "/checkout";
                  }
                }}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const AddToBasketComponent: React.FC<AddToBasketProps> = ({
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
